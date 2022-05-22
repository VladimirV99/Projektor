import { Fragment, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/material';
import ManageMovies from './ManageMovies';
import Helmet from 'react-helmet';

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

const AdminDashboard = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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
                        <Tab label="Users" />
                        <Tab label="Screenings" />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <ManageMovies />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Dashboard for managing people
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Dashboard for managing users
                </TabPanel>
                <TabPanel value={value} index={3}>
                    Dashboard for managing screenings
                </TabPanel>
            </Box>
        </Fragment>
    );
};

export default AdminDashboard;
