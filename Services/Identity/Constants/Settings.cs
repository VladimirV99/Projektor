namespace Identity.Constants
{
    public static class Settings
    {
        public const bool PASSWORD_REQUIRE_LOWERCASE = true;
        public const bool PASSWORD_REQUIRE_UPPERCASE = true;
        public const bool PASSWORD_REQUIRE_DIGIT = true;
        public const bool PASSWORD_REQUIRE_SYMBOL = false;
        public const int PASSWORD_MIN_LENGTH = 8;

        public const int PAGE_SIZE_MAX = 20;
        public const int PAGE_SIZE_DEFAULT = 10;
    }
}
