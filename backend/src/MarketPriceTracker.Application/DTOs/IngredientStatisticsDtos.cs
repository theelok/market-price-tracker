namespace MarketPriceTracker.Application.DTOs;

public class IngredientStatisticsDto
{
    public int IngredientId { get; set; }
    public string IngredientName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int PurchaseCount { get; set; }
    public decimal? LowestPrice { get; set; }
    public decimal? HighestPrice { get; set; }
    public decimal? AveragePrice { get; set; }
    public decimal? LatestPrice { get; set; }
    public decimal? PriceDifferenceFromPrevious { get; set; }
    public IReadOnlyList<PriceHistoryPointDto> PriceHistory { get; set; } = [];
}

public class PriceHistoryPointDto
{
    public DateTime Date { get; set; }
    public decimal UnitPrice { get; set; }
    public string ShopName { get; set; } = string.Empty;
}
