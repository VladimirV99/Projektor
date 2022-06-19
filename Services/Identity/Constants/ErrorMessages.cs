namespace Identity.Constants
{
    public static class ErrorMessages
    {
        public const string FIRST_NAME_REQUIRED = "First name is required";

        public const string LAST_NAME_REQUIRED = "Last name is required";

        public const string EMAIL_REQUIRED = "Email is required";
        public const string EMAIL_INVALID = "Email is invalid";
        public const string EMAIL_UNIQUE = "Email is already in use";

        public const string PASSWORD_REQUIRED = "Password is required";
        public const string PASSWORD_REQUIRE_LENGTH = "Password must be at least {MinLength} characters long";
        public const string PASSWORD_REQUIRE_LOWERCASE = "Password must contain a lowercase letter";
        public const string PASSWORD_REQUIRE_UPPERCASE = "Password must contain an uppercase letter";
        public const string PASSWORD_REQUIRE_DIGIT = "Password must contain a digit";
        public const string PASSWORD_REQUIRE_SYMBOL = "Password must contain a special character";

        public const string NEW_PASSWORD_REQUIRED = "New password is required";
        public const string NEW_PASSWORD_SAME = "New password can't be the same as old";

        public const string REFRESH_TOKEN_REQUIRED = "Refresh token is required";

        public const string PAGE_NUMBER_REQUIRED = "Page number is required";
        public const string PAGE_NUMBER_RANGE = "Page number must be greater or equal to 1";
        public const string PAGE_SIZE_RANGE = "Page size must be between 1 and 20";
    }
}
