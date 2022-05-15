import React from 'react';
import Screening from 'models/Screening';
import ScheduleItem from 'models/Screening/ScreeningSchedule';
import { toDateString, toTimeString } from 'util/dateUtils';
import * as S from './index.styles';

type ScreeningScheduleProps = {
    schedule: ScheduleItem[];
};

const ScreeningSchedule = ({
    schedule,
}: ScreeningScheduleProps): JSX.Element => {
    return (
        <div>
            {schedule.map((group: ScheduleItem, i: number) => {
                return (
                    <div key={i}>
                        <S.ScheduleKey>
                            {toDateString(new Date(parseInt(group.key)))}
                        </S.ScheduleKey>
                        <div>
                            {group.screenings.map(
                                (screening: Screening, i: number) => {
                                    return (
                                        <S.ScreeningItem
                                            key={i}
                                            to={`/screening/${screening.id}`}
                                        >
                                            <S.ScreeningItemTime>
                                                {toTimeString(
                                                    screening.movieStart
                                                )}
                                            </S.ScreeningItemTime>
                                            <S.ScreeningItemHall>
                                                Hall {screening.hallId}
                                            </S.ScreeningItemHall>
                                        </S.ScreeningItem>
                                    );
                                }
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ScreeningSchedule;
