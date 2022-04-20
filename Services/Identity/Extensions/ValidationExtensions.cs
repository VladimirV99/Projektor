using FluentValidation;
using Identity.Constants;

namespace Identity.Extensions
{
    public static class ValidationExtensions
    {
        public static IRuleBuilder<T, string> PasswordRequirementsMet<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            ruleBuilder = ruleBuilder
                .MinimumLength(Settings.PASSWORD_MIN_LENGTH).WithMessage(ErrorMessages.PASSWORD_REQUIRE_LENGTH);

            if (Settings.PASSWORD_REQUIRE_LOWERCASE)
            {
                ruleBuilder = ruleBuilder
                    .Must(password => password.Any(c => char.IsLower(c))).WithMessage(ErrorMessages.PASSWORD_REQUIRE_LOWERCASE);
            }
            if (Settings.PASSWORD_REQUIRE_UPPERCASE)
            {
                ruleBuilder = ruleBuilder
                    .Must(password => password.Any(c => char.IsUpper(c))).WithMessage(ErrorMessages.PASSWORD_REQUIRE_UPPERCASE);
            }
            if (Settings.PASSWORD_REQUIRE_DIGIT)
            {
                ruleBuilder = ruleBuilder
                    .Must(password => password.Any(c => char.IsDigit(c))).WithMessage(ErrorMessages.PASSWORD_REQUIRE_DIGIT);
            }
            if (Settings.PASSWORD_REQUIRE_SYMBOL)
            {
                ruleBuilder = ruleBuilder
                    .Must(password => password.Any(c => char.IsSymbol(c))).WithMessage(ErrorMessages.PASSWORD_REQUIRE_SYMBOL);
            }

            return ruleBuilder;
        }
    }
}
