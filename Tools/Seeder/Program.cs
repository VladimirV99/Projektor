using Seeder.Seeders;

if (args.Length == 0)
{
    Console.WriteLine("You must specify which databases to seed");
    Console.WriteLine("Supported options:");
    Console.WriteLine("  --all");
    Console.WriteLine("  --mssql");
    Console.WriteLine("  --postgres");
    Console.WriteLine("  --movies");
    Console.WriteLine("  --screenings");
    Console.WriteLine("  --reservations");
    Console.WriteLine("  --reviews");
    return 1;
}

var seedMovies = false;
var seedScreenings = false;
var seedReservations = false;
var seedReviews = false;

foreach (var arg in args)
{
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

if (seedMovies) MovieSeeder.Seed();
if (seedScreenings) ScreeningSeeder.Seed();
// if (seedReservations) ReservationSeeder.Seed();
if (seedReviews) ReviewSeeder.Seed();

return 0;