namespace MarketPriceTracker.Domain.Models;

/// <summary>
/// A single purchase record for an ingredient at a specific shop and date.
/// </summary>
public class Purchase
{
    public int Id { get; set; }
    public int IngredientId { get; set; }
    public required string ShopName { get; set; }
    public decimal Quantity { get; set; }
    public required string Unit { get; set; }
    public decimal Price { get; set; }
    public DateTime PurchaseDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Ingredient Ingredient { get; set; } = null!;
}
