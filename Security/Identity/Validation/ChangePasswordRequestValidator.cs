using FluentValidation;
using Identity.Extensions;
using Identity.Models;

namespace Identity.Validation
{
    public class ChangePasswordRequestValidator : AbstractValidator<UserChangePasswordRequest>
    {
        public ChangePasswordRequestValidator()
        {
            RuleFor(x => x.NewPassword).PasswordRequirementsMet();
        }
    }
}
