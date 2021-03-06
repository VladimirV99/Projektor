import { Fragment, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
import ManageMovies from './ManageMovies';
import Helmet from 'react-helmet';
import ManageScreenings from './ManageScreenings';
import ManagePeople from './ManagePeople';
import ManageUsers from './ManageUsers';
import { ROLE_ADMINISTRATOR, ROLE_CUSTOMER } from 'constants/common';
import ManageHalls from './ManageHalls';

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

type TabValuesType = {
    [id: string]: number;
};

const tabValues: TabValuesType = {
    movies: 0,
    people: 1,
    screenings: 2,
    halls: 3,
    customers: 4,
    administrators: 5,
};

const AdminDashboard = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        navigate(
            `/admin/${
                (Object.entries(tabValues).find(([, v]) => v === newValue) ??
                    [])[0]
            }`
        );
    };

    const { tab } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!tab) {
            return navigate('/admin/movies');
        }
        if (!Object.keys(tabValues).includes(tab)) {
            return navigate('/not-found');
        }
        setValue(tabValues[tab]);
    }, [tab]);

    return (
        <Fragment>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Movies" />
                        <Tab label="People" />
                        <Tab label="Screenings" />
                        <Tab label="Halls" />
                        <Tab label="Customers" />
                        <Tab label="Administrators" />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <ManageMovies />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ManagePeople />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <ManageScreenings />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <ManageHalls />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <ManageUsers role={ROLE_CUSTOMER} />
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <ManageUsers role={ROLE_ADMINISTRATOR} />
                </TabPanel>
            </Box>
        </Fragment>
    );
};

export default AdminDashboard;
