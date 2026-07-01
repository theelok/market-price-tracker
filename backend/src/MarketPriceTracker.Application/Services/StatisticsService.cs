using MarketPriceTracker.Application.DTOs;
using MarketPriceTracker.Application.Interfaces;
using MarketPriceTracker.Domain.Models;

namespace MarketPriceTracker.Application.Services;

public class StatisticsService(
    IIngredientRepository ingredientRepository,
    IPurchaseRepository purchaseRepository) : IStatisticsService
{
    public async Task<StatisticsDto> GetStatisticsAsync(CancellationToken cancellationToken = default)
    {
        var ingredients = await ingredientRepository.GetAllAsync(cancellationToken);
        var purchases = await purchaseRepository.GetAllAsync(cancellationToken);

        var unitPrices = purchases
            .Where(p => p.Quantity > 0)
            .Select(p => Math.Round(p.Price / p.Quantity, 2))
            .ToList();

        var totalSpent = purchases.Sum(p => p.Price);

        var spendingByCategory = ingredients
            .GroupBy(i => i.Category)
            .Select(g => new CategorySpendingDto
            {
                Category = g.Key,
                TotalSpent = g.SelectMany(i => i.Purchases).Sum(p => p.Price),
                PurchaseCount = g.SelectMany(i => i.Purchases).Count()
            })
            .OrderByDescending(x => x.TotalSpent)
            .ToList();

        var topShops = purchases
            .GroupBy(p => p.ShopName)
            .Select(g => new ShopSpendingDto
            {
                ShopName = g.Key,
                TotalSpent = g.Sum(p => p.Price),
                PurchaseCount = g.Count()
            })
            .OrderByDescending(x => x.TotalSpent)
            .Take(5)
            .ToList();

        var recentPurchases = purchases
            .OrderByDescending(p => p.PurchaseDate)
            .Take(8)
            .Select(MapPurchase)
            .ToList();

        var latestPriceChanges = BuildPriceChanges(purchases);

        return new StatisticsDto
        {
            TotalIngredients = ingredients.Count,
            TotalPurchases = purchases.Count,
            TotalSpent = totalSpent,
            AveragePurchasePrice = purchases.Count > 0 ? Math.Round(totalSpent / purchases.Count, 2) : 0,
            AveragePrice = unitPrices.Count > 0 ? Math.Round(unitPrices.Average(), 2) : 0,
            LowestPrice = unitPrices.Count > 0 ? unitPrices.Min() : null,
            HighestPrice = unitPrices.Count > 0 ? unitPrices.Max() : null,
            SpendingByCategory = spendingByCategory,
            TopShops = topShops,
            RecentPurchases = recentPurchases,
            LatestPriceChanges = latestPriceChanges
        };
    }

    public async Task<IReadOnlyList<IngredientStatisticsDto>> GetIngredientStatisticsAsync(
        CancellationToken cancellationToken = default)
    {
        var ingredients = await ingredientRepository.GetAllAsync(cancellationToken);

        return ingredients
            .Select(BuildIngredientStatistics)
            .OrderBy(x => x.IngredientName)
            .ToList();
    }

    private static IngredientStatisticsDto BuildIngredientStatistics(Ingredient ingredient)
    {
        var purchases = ingredient.Purchases
            .Where(p => p.Quantity > 0)
            .OrderBy(p => p.PurchaseDate)
            .ToList();

        var unitPrices = purchases
            .Select(p => Math.Round(p.Price / p.Quantity, 2))
            .ToList();

        decimal? priceDiff = null;
        if (unitPrices.Count >= 2)
        {
            priceDiff = unitPrices[^1] - unitPrices[^2];
        }

        return new IngredientStatisticsDto
        {
            IngredientId = ingredient.Id,
            IngredientName = ingredient.Name,
            Category = ingredient.Category,
            PurchaseCount = purchases.Count,
            LowestPrice = unitPrices.Count > 0 ? unitPrices.Min() : null,
            HighestPrice = unitPrices.Count > 0 ? unitPrices.Max() : null,
            AveragePrice = unitPrices.Count > 0 ? Math.Round(unitPrices.Average(), 2) : null,
            LatestPrice = unitPrices.Count > 0 ? unitPrices[^1] : null,
            PriceDifferenceFromPrevious = priceDiff,
            PriceHistory = purchases.Select(p => new PriceHistoryPointDto
            {
                Date = p.PurchaseDate,
                UnitPrice = Math.Round(p.Price / p.Quantity, 2),
                ShopName = p.ShopName
            }).ToList()
        };
    }

    private static List<PriceChangeDto> BuildPriceChanges(IReadOnlyList<Purchase> purchases)
    {
        return purchases
            .GroupBy(p => p.IngredientId)
            .Select(group =>
            {
                var ordered = group.OrderByDescending(p => p.PurchaseDate).ToList();
                if (ordered.Count < 2 || ordered[0].Quantity <= 0 || ordered[1].Quantity <= 0)
                {
                    return null;
                }

                var latest = ordered[0];
                var previous = ordered[1];
                var latestUnit = Math.Round(latest.Price / latest.Quantity, 2);
                var previousUnit = Math.Round(previous.Price / previous.Quantity, 2);
                var change = latestUnit - previousUnit;
                var changePercent = previousUnit > 0
                    ? Math.Round(change / previousUnit * 100, 1)
                    : 0;

                return new PriceChangeDto
                {
                    IngredientId = latest.IngredientId,
                    IngredientName = latest.Ingredient?.Name ?? string.Empty,
                    PreviousUnitPrice = previousUnit,
                    LatestUnitPrice = latestUnit,
                    ChangeAmount = change,
                    ChangePercent = changePercent,
                    PreviousDate = previous.PurchaseDate,
                    LatestDate = latest.PurchaseDate
                };
            })
            .Where(x => x is not null)
            .Cast<PriceChangeDto>()
            .OrderByDescending(x => x.LatestDate)
            .Take(8)
            .ToList();
    }

    private static PurchaseDto MapPurchase(Purchase p) => new()
    {
        Id = p.Id,
        IngredientId = p.IngredientId,
        IngredientName = p.Ingredient?.Name ?? string.Empty,
        ShopName = p.ShopName,
        Quantity = p.Quantity,
        Unit = p.Unit,
        Price = p.Price,
        PurchaseDate = p.PurchaseDate,
        Notes = p.Notes,
        CreatedAt = p.CreatedAt
    };
}

