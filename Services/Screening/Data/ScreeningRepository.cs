using System;

namespace Screening.Data
{
    public class ScreeningRepository : IScreeningRepository
    {
        Task<List<Entities.Screening>> IScreeningRepository.GetAllScreenings()
        {
            throw new NotImplementedException();
        }

        Task<Entities.Screening> IScreeningRepository.GetScreeningById(int id)
        {
            throw new NotImplementedException();
        }
    }
}

