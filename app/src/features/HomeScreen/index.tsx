import { Box, Tab, Tabs } from '@mui/material';
import axios from 'axios';
import MoviePoster from 'components/MoviePoster';
import { GET_CURRENT_MOVIES_URL, GET_FUTURE_MOVIES_URL } from 'constants/api';
import Movie from 'models/Movie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './index.styles';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const HomeScreen = (): JSX.Element => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const navigate = useNavigate();

    const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
    const [futureMovies, setFutureMovies] = useState<Movie[]>([]);

    useEffect(() => {
        axios.get<Movie[]>(GET_CURRENT_MOVIES_URL).then((res) => {
            setCurrentMovies(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get<Movie[]>(GET_FUTURE_MOVIES_URL).then((res) => {
            setFutureMovies(res.data);
        });
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="Home Page"
                >
                    <Tab label="Currently Playing" />
                    <Tab label="Coming Soon" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <S.PosterList>
                    {currentMovies.map((movie) => (
                        <MoviePoster
                            key={movie.id}
                            movie={movie}
                            onClick={() => {
                                navigate(`/movie/${movie.id}`);
                            }}
                        />
                    ))}
                </S.PosterList>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <S.PosterList>
                    {futureMovies.map((movie) => (
                        <MoviePoster
                            key={movie.id}
                            movie={movie}
                            onClick={() => {
                                navigate(`/movie/${movie.id}`);
                            }}
                        />
                    ))}
                </S.PosterList>
            </TabPanel>
        </Box>
    );
};

export default HomeScreen;
