namespace MarketPriceTracker.Application.DTOs;

public class StatisticsDto
{
    public int TotalIngredients { get; set; }
    public int TotalPurchases { get; set; }
    public decimal TotalSpent { get; set; }
    public decimal AveragePurchasePrice { get; set; }
    public decimal AveragePrice { get; set; }
    public decimal? LowestPrice { get; set; }
    public decimal? HighestPrice { get; set; }
    public IReadOnlyList<CategorySpendingDto> SpendingByCategory { get; set; } = [];
    public IReadOnlyList<ShopSpendingDto> TopShops { get; set; } = [];
    public IReadOnlyList<PurchaseDto> RecentPurchases { get; set; } = [];
    public IReadOnlyList<PriceChangeDto> LatestPriceChanges { get; set; } = [];
}

public class CategorySpendingDto
{
    public string Category { get; set; } = string.Empty;
    public decimal TotalSpent { get; set; }
    public int PurchaseCount { get; set; }
}

public class ShopSpendingDto
{
    public string ShopName { get; set; } = string.Empty;
    public decimal TotalSpent { get; set; }
    public int PurchaseCount { get; set; }
}

public class PriceChangeDto
{
    public int IngredientId { get; set; }
    public string IngredientName { get; set; } = string.Empty;
    public decimal PreviousUnitPrice { get; set; }
    public decimal LatestUnitPrice { get; set; }
    public decimal ChangeAmount { get; set; }
    public decimal ChangePercent { get; set; }
    public DateTime PreviousDate { get; set; }
    public DateTime LatestDate { get; set; }
}
