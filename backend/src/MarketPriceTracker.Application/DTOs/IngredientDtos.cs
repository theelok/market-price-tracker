using System.ComponentModel.DataAnnotations;

namespace MarketPriceTracker.Application.DTOs;

public class IngredientDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int PurchaseCount { get; set; }
    public decimal? LatestPrice { get; set; }
    public DateTime? LatestPurchaseDate { get; set; }
}

public class CreateIngredientDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Category is required.")]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "Category must be between 1 and 50 characters.")]
    public string Category { get; set; } = string.Empty;
}

public class UpdateIngredientDto
{
    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Category is required.")]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "Category must be between 1 and 50 characters.")]
    public string Category { get; set; } = string.Empty;
}
