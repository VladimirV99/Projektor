namespace Review.Constants
{
    public static class ErrorMessages
    {
        public const string SUMMARY_REQUIRED = "Summary is required";
        public const string SUMMARY_MAX_LENGTH = "Summary cannot exceed 50 characters";

        public const string BODY_REQUIRED = "Body is required";
        public const string BODY_MAX_LENGTH = "Body cannot exceed 200 characters";

        public const string SCORE_REQUIRED = "Score is required";
        public const string SCORE_RANGE = "Score must be between 0 and 10";

        public const string WATCHED_TIME_REQUIRED = "Movie screening time is required";

        public const string MOVIE_ID_REQUIRED = "Movie must be specified";

        public const string USER_ID_REQUIRED = "User must be specified";

        public const string PAGE_SIZE_RANGE = "Page size must be between 1 and 100";
    }
}
