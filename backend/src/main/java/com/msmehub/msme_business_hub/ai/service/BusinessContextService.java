package com.msmehub.msme_business_hub.ai.service;

import com.msmehub.msme_business_hub.entity.CustomerOrder;
import com.msmehub.msme_business_hub.entity.Expense;
import com.msmehub.msme_business_hub.entity.OrderItem;
import com.msmehub.msme_business_hub.entity.OrderStatus;
import com.msmehub.msme_business_hub.entity.Product;
import com.msmehub.msme_business_hub.repository.CustomerOrderRepository;
import com.msmehub.msme_business_hub.repository.CustomerRepository;
import com.msmehub.msme_business_hub.repository.ExpenseRepository;
import com.msmehub.msme_business_hub.repository.InvoiceRepository;
import com.msmehub.msme_business_hub.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class BusinessContextService {

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private static final DateTimeFormatter MONTH_FORMAT =
            DateTimeFormatter.ofPattern("MMM yyyy");

    private final CustomerOrderRepository orderRepository;
    private final ExpenseRepository expenseRepository;
    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public BusinessContextService(
            CustomerOrderRepository orderRepository,
            ExpenseRepository expenseRepository,
            InvoiceRepository invoiceRepository,
            ProductRepository productRepository,
            CustomerRepository customerRepository
    ) {
        this.orderRepository = orderRepository;
        this.expenseRepository = expenseRepository;
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public String buildBusinessContext() {

        List<CustomerOrder> orders = orderRepository.findAll();

        List<Expense> expenses = expenseRepository.findAll();

        List<Product> products = productRepository.findAll();

        long customerCount = customerRepository.count();

        long invoiceCount = invoiceRepository.count();

        /*
         * Cancelled orders must not contribute to revenue.
         */
        List<CustomerOrder> validOrders = orders.stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELLED)
                .toList();

        /*
         * Revenue
         */
        BigDecimal totalRevenue = validOrders.stream()
                .map(CustomerOrder::getTotal)
                .filter(Objects::nonNull)
                .reduce(ZERO, BigDecimal::add);

        /*
         * Expenses
         */
        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .filter(Objects::nonNull)
                .reduce(ZERO, BigDecimal::add);

        /*
         * Estimated profit.
         *
         * IMPORTANT:
         * Product purchase cost / COGS does not currently exist
         * in the Product entity.
         *
         * Therefore this is:
         *
         * Revenue - Recorded Expenses
         *
         * and must not be called accounting net profit.
         */
        BigDecimal estimatedProfit =
                totalRevenue.subtract(totalExpenses);

        BigDecimal profitMargin = ZERO;

        if (totalRevenue.compareTo(ZERO) > 0) {

            profitMargin = estimatedProfit
                    .multiply(BigDecimal.valueOf(100))
                    .divide(
                            totalRevenue,
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        long pendingOrders = orders.stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.PENDING)
                .count();

        long completedOrders = orders.stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.COMPLETED)
                .count();

        long cancelledOrders = orders.stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.CANCELLED)
                .count();

        /*
         * Low-stock threshold.
         *
         * This is an application-level AI insight threshold,
         * not a database rule.
         */
        long lowStockProducts = products.stream()
                .filter(product -> product.getStock() != null)
                .filter(product -> product.getStock() < 10)
                .count();

        /*
         * Expense categories.
         */
        Map<String, BigDecimal> expenseByCategory =
                expenses.stream()
                        .filter(expense ->
                                expense.getCategory() != null)
                        .collect(Collectors.groupingBy(
                                Expense::getCategory,
                                Collectors.reducing(
                                        ZERO,
                                        expense ->
                                                safe(expense.getAmount()),
                                        BigDecimal::add
                                )
                        ));

        List<Map.Entry<String, BigDecimal>>
                topExpenseCategories =
                expenseByCategory.entrySet()
                        .stream()
                        .sorted(
                                Map.Entry
                                        .<String, BigDecimal>
                                        comparingByValue()
                                        .reversed()
                        )
                        .limit(10)
                        .toList();

        /*
         * Product sales.
         */
        Map<Long, ProductSales> productSales =
                new HashMap<>();

        for (CustomerOrder order : validOrders) {

            if (order.getItems() == null) {
                continue;
            }

            for (OrderItem item : order.getItems()) {

                if (item == null ||
                        item.getProduct() == null) {
                    continue;
                }

                Product product = item.getProduct();

                Long productId = product.getId();

                if (productId == null) {
                    continue;
                }

                ProductSales sales =
                        productSales.computeIfAbsent(
                                productId,
                                id -> new ProductSales(
                                        product.getName()
                                )
                        );

                sales.quantitySold +=
                        safeInteger(item.getQuantity());

                sales.revenue =
                        sales.revenue.add(
                                safe(item.getLineTotal())
                        );
            }
        }

        List<ProductSales> topProducts =
                productSales.values()
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        ProductSales::getRevenue
                                ).reversed()
                        )
                        .limit(10)
                        .toList();

        /*
         * Low stock products.
         */
        List<Product> lowStock =
                products.stream()
                        .filter(product ->
                                product.getStock() != null)
                        .filter(product ->
                                product.getStock() < 10)
                        .sorted(
                                Comparator.comparing(
                                        Product::getStock
                                )
                        )
                        .limit(10)
                        .toList();

        /*
         * Monthly revenue.
         */
        Map<YearMonth, BigDecimal> monthlyRevenue =
                new HashMap<>();

        for (CustomerOrder order : validOrders) {

            if (order.getOrderDate() == null) {
                continue;
            }

            YearMonth month =
                    YearMonth.from(order.getOrderDate());

            monthlyRevenue.merge(
                    month,
                    safe(order.getTotal()),
                    BigDecimal::add
            );
        }

        /*
         * Monthly expenses.
         */
        Map<YearMonth, BigDecimal> monthlyExpenses =
                new HashMap<>();

        for (Expense expense : expenses) {

            if (expense.getDate() == null) {
                continue;
            }

            YearMonth month =
                    YearMonth.from(expense.getDate());

            monthlyExpenses.merge(
                    month,
                    safe(expense.getAmount()),
                    BigDecimal::add
            );
        }

        /*
         * Build six-month trend.
         */
        StringBuilder monthlyTrend =
                new StringBuilder();

        YearMonth currentMonth =
                YearMonth.now();

        for (int i = 5; i >= 0; i--) {

            YearMonth month =
                    currentMonth.minusMonths(i);

            BigDecimal revenue =
                    monthlyRevenue.getOrDefault(
                            month,
                            ZERO
                    );

            BigDecimal expense =
                    monthlyExpenses.getOrDefault(
                            month,
                            ZERO
                    );

            BigDecimal profit =
                    revenue.subtract(expense);

            monthlyTrend.append(
                    String.format(
                            "%s | Revenue: %s | Expenses: %s | Estimated Profit: %s%n",
                            month.format(MONTH_FORMAT),
                            money(revenue),
                            money(expense),
                            money(profit)
                    )
            );
        }

        StringBuilder context =
                new StringBuilder();

        context.append("""
                BUSINESS DATA
                =============

                IMPORTANT DATA RULES
                --------------------
                - This information comes from the application's database.
                - Do not invent missing business numbers.
                - Cancelled orders are excluded from revenue.
                - Estimated profit = revenue - recorded expenses.
                - Product purchase cost / COGS is not stored.
                - Therefore estimated profit must not be presented as accounting net profit.
                - Invoices are counted separately.
                - Do not add invoice totals to order revenue because this can double-count revenue.

                OVERALL BUSINESS METRICS
                ------------------------
                Customers: %d
                Products: %d
                Orders: %d
                Invoices: %d

                Revenue: %s
                Recorded Expenses: %s
                Estimated Profit: %s
                Estimated Profit Margin: %s%%

                Pending Orders: %d
                Completed Orders: %d
                Cancelled Orders: %d
                Low Stock Products: %d

                SIX MONTH PERFORMANCE
                ---------------------
                """.formatted(
                customerCount,
                products.size(),
                orders.size(),
                invoiceCount,
                money(totalRevenue),
                money(totalExpenses),
                money(estimatedProfit),
                profitMargin,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                lowStockProducts
        ));

        context.append(monthlyTrend);

        /*
         * Top products.
         */
        context.append("""
                
                TOP PRODUCTS BY REVENUE
                -----------------------
                """);

        if (topProducts.isEmpty()) {

            context.append(
                    "No product sales data available.\n"
            );

        } else {

            int rank = 1;

            for (ProductSales product :
                    topProducts) {

                context.append(
                        String.format(
                                "%d. %s | Quantity Sold: %d | Revenue: %s%n",
                                rank++,
                                product.name,
                                product.quantitySold,
                                money(product.revenue)
                        )
                );
            }
        }

        /*
         * Expense categories.
         */
        context.append("""
                
                TOP EXPENSE CATEGORIES
                ----------------------
                """);

        if (topExpenseCategories.isEmpty()) {

            context.append(
                    "No expense data available.\n"
            );

        } else {

            for (Map.Entry<String, BigDecimal> entry :
                    topExpenseCategories) {

                context.append("- ")
                        .append(entry.getKey())
                        .append(": ")
                        .append(money(entry.getValue()))
                        .append("\n");
            }
        }

        /*
         * Low stock.
         */
        context.append("""
                
                LOW STOCK PRODUCTS
                ------------------
                """);

        if (lowStock.isEmpty()) {

            context.append(
                    "No low-stock products.\n"
            );

        } else {

            for (Product product : lowStock) {

                context.append("- ")
                        .append(product.getName())
                        .append(" | Stock: ")
                        .append(product.getStock())
                        .append(" | Price: ")
                        .append(money(product.getPrice()))
                        .append("\n");
            }
        }

        context.append("\nEND BUSINESS DATA");

        return context.toString();
    }

    private BigDecimal safe(BigDecimal value) {

        return value == null
                ? ZERO
                : value;
    }

    private int safeInteger(Integer value) {

        return value == null
                ? 0
                : value;
    }

    private String money(BigDecimal value) {

        return "₹" +
                safe(value)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        )
                        .toPlainString();
    }

    private static final class ProductSales {

        private final String name;

        private int quantitySold;

        private BigDecimal revenue = ZERO;

        private ProductSales(String name) {
            this.name = name;
        }

        private BigDecimal getRevenue() {
            return revenue;
        }
    }
}