using AutoMapper;
using Common.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Review.Constants;
using Review.Entities;
using Review.Models;
using Review.Repositories;
using System.Security.Claims;

namespace Review.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<ReviewController> _logger;

        public ReviewController(IReviewRepository repository, IMapper mapper, ILogger<ReviewController> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // This is a debug function
        // Watched movies should be added asynchronously by the reservation service
        // [Authorize(Roles = Roles.ADMINISTRATOR)]
        [HttpPost("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddWatchedMovie([FromBody] AddWatchedMovieRequest request)
        {
            // Check for user in database
            var user = await _repository.GetUserById(request.UserId);
            if (user == null)
            {
                // TODO Fetch user from identity service using RPC. If it doesn't exists return 404
                await _repository.CreateUser(new User
                {
                    Id = request.UserId,
                    Email = "test@test.com",
                    FirstName = "John",
                    LastName = "Doe"
                });
            }
            
            // TODO Check if movie exists from movie service using RPC

            // Add record to database
            await _repository.AddWatchedMovie(_mapper.Map<WatchedMovie>(request));
            return Ok();
        }

        [Authorize(Roles = Roles.CUSTOMER)]
        [HttpPost("[action]")]
        [ProducesResponseType(typeof(MovieReviewModel), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<MovieReviewModel>> CreateReview([FromBody] ReviewRequest request)
        {
            // Find user in table
            // var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            // var user = await _repository.GetUserById(userId);
            // if (user == null)
            // {
            //     return BadRequest(ErrorMessages.USER_MOVIE_NOT_WATCHED);
            // }
            
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _repository.GetUserByEmail(email);
            if (user == null)
            {
                return BadRequest(ErrorMessages.USER_MOVIE_NOT_WATCHED);
            }
            var userId = user.Id;

            // Check whether the user watched the movie
            if (!await _repository.HasWatchedMovie(userId, request.MovieId))
            {
                return BadRequest(ErrorMessages.USER_MOVIE_NOT_WATCHED);
            }

            // Create review
            MovieReview review = new()
            {
                Summary = request.Summary,
                Body = request.Body,
                Score = request.Score,
                MovieId = request.MovieId,
                ReviewerId = userId
            };
            var result = await _repository.CreateReview(review);
            
            return CreatedAtAction(
                nameof(GetReview), 
                new { movieId = request.MovieId, reviewerId = userId },
                _mapper.Map<MovieReviewModel>(result)
            );
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(MovieReviewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MovieReviewModel>> GetReview([FromQuery] ReviewIdRequest request)
        {
            var review = await _repository.GetReview(request.MovieId, request.ReviewerId);
            if (review == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<MovieReviewModel>(review));
        }

        [HttpGet("[action]")]
        [ProducesResponseType(typeof(IEnumerable<MovieReviewModel>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<MovieReviewModel>>> GetReviewsForMovie([FromQuery] GetReviewsForMovieRequest request)
        {
            // TODO Check movie exists
            var result = await _repository.GetReviewsForMovie(request.MovieId, request.CreatedAfter, request.PerPage ?? Settings.PAGE_SIZE_DEFAULT);
            return Ok(_mapper.Map<IEnumerable<MovieReviewModel>>(result));
        }

        [Authorize(Roles = Roles.CUSTOMER)]
        [HttpPut("[action]")]
        [ProducesResponseType(typeof(MovieReviewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MovieReviewModel>> UpdateReview([FromBody] ReviewRequest request)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _repository.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound();
            }

            var review = await _repository.GetReview(request.MovieId, user.Id);
            if (review == null)
            {
                return NotFound();
            }

            review.Summary = request.Summary;
            review.Body = request.Body;
            review.Score = request.Score;

            await _repository.UpdateReview(review);
            return Ok();
        }

        [Authorize(Roles = Roles.CUSTOMER)]
        [HttpDelete("[action]/{movieId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteReview(int movieId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _repository.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound();
            }

            if (!await _repository.DeleteReview(movieId, user.Id))
            {
                return NotFound();
            }
            return Ok();
        }
        
        [Authorize(Roles = Roles.ADMINISTRATOR)]
        [HttpDelete("[action]")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveReview([FromQuery] ReviewIdRequest request)
        {
            if (!await _repository.DeleteReview(request.MovieId, request.ReviewerId))
            {
                return NotFound();
            }
            return Ok();
        }
    }
}
