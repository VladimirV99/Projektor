using Seeder.Seeders;

switch (args.Length)
{
    case 0:
        Console.WriteLine("You must specify which action to perform");
        Console.WriteLine("Supported actions:");
        Console.WriteLine("  seed");
        Console.WriteLine("  clear");
        Console.WriteLine("  drop");
        return 1;
    case 1:
        Console.WriteLine("You must specify which databases to seed");
        Console.WriteLine("Supported options:");
        Console.WriteLine("  --all");
        Console.WriteLine("  --mssql");
        Console.WriteLine("  --postgres");
        Console.WriteLine("  --movies");
        Console.WriteLine("  --screenings");
        Console.WriteLine("  --reservations");
        Console.WriteLine("  --reviews");
        return 2;
}

if (args[0] != "seed" && args[0] != "clear" && args[0] != "drop")
{
    Console.WriteLine($"Unknown action: {args[0]}");
    return 3;
}

var seedMovies = false;
var seedScreenings = false;
var seedReservations = false;
var seedReviews = false;

for (var i = 1; i < args.Length; i++)
{
    var arg = args[i];
    switch (arg)
    {
        case "--all":
            seedMovies = true;
            seedScreenings = true;
            seedReservations = true;
            seedReviews = true;
            break;
        case "--mssql":
            seedMovies = true;
            seedScreenings = true;
            seedReservations = true;
            break;
        case "--postgres":
            seedReviews = true;
            break;
        case "--movies":
            seedMovies = true;
            break;
        case "--screenings":
            seedScreenings = true;
            break;
        case "--reservations":
            seedReservations = true;
            break;
        case "--reviews":
            seedReviews = true;
            break;
        default:
            Console.WriteLine($"Unknown option: {arg}");
            break;
    }
}

switch (args[0])
{
    case "seed":
        if (seedMovies) MovieSeeder.Seed();
        if (seedScreenings) ScreeningSeeder.Seed();
        if (seedReservations) ReservationSeeder.Seed();
        if (seedReviews) ReviewSeeder.Seed();
        break;
    case "clear":
        if (seedMovies) MovieSeeder.Clear();
        if (seedScreenings) ScreeningSeeder.Clear();
        if (seedReservations) ReservationSeeder.Clear();
        if (seedReviews) ReviewSeeder.Clear();
        break;
    case "drop":
        if (seedMovies) MovieSeeder.Drop();
        if (seedScreenings) ScreeningSeeder.Drop();
        if (seedReservations) ReservationSeeder.Drop();
        if (seedReviews) ReviewSeeder.Drop();
        break;
}

return 0;