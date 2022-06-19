using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Identity.Constants;

namespace Identity.Models
{
    public class PaginationRequest
    {
        [Required(ErrorMessage = ErrorMessages.PAGE_NUMBER_REQUIRED)]
        [Range(1, int.MaxValue, ErrorMessage = ErrorMessages.PAGE_NUMBER_RANGE)]
        public int Page { get; set; }
        
        [DefaultValue(Settings.PAGE_SIZE_DEFAULT)]
        [Range(1, Settings.PAGE_SIZE_MAX, ErrorMessage=ErrorMessages.PAGE_SIZE_RANGE)]
        public int PerPage { get; set; }
    }
}