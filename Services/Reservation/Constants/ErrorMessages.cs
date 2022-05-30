namespace Reservation.Constants
{
    public static class ErrorMessages
    {
        public const string HALL_ID_REQUIRED = "Hall Id is required";

        public const string SCREENING_ID_REQUIRED = "Screening Id is required";

        public const string HALL_ROWS_REQUIRED = "Number of rows is required";
        public const string HALL_ROWS_RANGE = "Number of rows must be between 0 and 50";

        public const string HALL_COLUMNS_REQUIRED = "Number of columns is required";
        public const string HALL_COLUMNS_RANGE = "Number of columns must be between 0 and 50";
        
        public const string SEAT_ROW_REQUIRED = "Seat row number is required";
        public const string SEAT_ROW_RANGE = "Seat row number must be between 0 and 50";
        
        public const string SEAT_COLUMN_REQUIRED = "Seat column number is requuired";
        public const string SEAT_COLUMN_RANGE = "Seat column number must be between 0 and 50";
        
        public const string SEAT_PRICE_REQUIRED = "Seat price multiplier is required";
        public const string SEAT_PRICE_RANGE = "Seat price multiplier must be between 0 and 2";

        public const string RESERVATION_SEATS_REQUIRED = "";
        public const string RESERVATION_MIN_SEATS = "";
        public const string RESERVATION_MAX_SEATS = "";
    }
}