using Common.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Review.Models;

namespace Review.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController : ControllerBase
    {
        // This is a debug function
        // Watched movies should be added asynchronously by the reservation service
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> AddWatchedMovie([FromBody] AddWatchedMovieRequest request)
        {
            throw new NotImplementedException();
        }

        [Authorize(Roles = Roles.CUSTOMER)]
        [HttpPost("[action]")]
        // TODO Return 201
        [ProducesResponseType(typeof(MovieReviewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<MovieReviewModel>> CreateReview([FromBody] CreateReviewRequest request)
        {
            throw new NotImplementedException();
        }

        [HttpGet("[action]/{reviewId}")]
        [ProducesResponseType(typeof(MovieReviewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MovieReviewModel>> GetReview(string reviewId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<MovieReviewModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<MovieReviewModel>>> GetReviewsForMovie([FromQuery] GetReviewsForMovieRequest request)
        {
            throw new NotImplementedException();
        }
    }
}
