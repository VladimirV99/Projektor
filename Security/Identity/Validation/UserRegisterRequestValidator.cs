using FluentValidation;
using Identity.Constants;
using Identity.Data;
using Identity.Extensions;
using Identity.Models;

namespace Identity.Validation
{
    public class UserRegisterRequestValidator : AbstractValidator<UserRegisterRequest>
    {
        private readonly IIdentityRepository _repository;

        public UserRegisterRequestValidator(IIdentityRepository repository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));

            RuleFor(x => x.Email)
                .NotNull().WithMessage(ErrorMessages.EMAIL_REQUIRED)
                .EmailAddress().WithMessage(ErrorMessages.EMAIL_INVALID)
                .DependentRules(() =>
                {
                    // Check is email unique only if other email validations have passed
                    RuleFor(x => x.Email)
                        .MustAsync(async (email, cancellationToken) =>
                        {
                            return (await _repository.GetUserByEmail(email)) == null;
                        })
                        .WithMessage(ErrorMessages.EMAIL_UNIQUE);
                });

            RuleFor(x => x.Password).PasswordRequirementsMet();
        }
    }
}
