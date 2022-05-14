import { useState } from 'react';
import { Container } from 'react-bootstrap';
import SearchInput from './SearchInput';
import { SEARCH_PEOPLE_URL } from 'constants/index';
import SelectedOptions from './SelectedOptions';

const AdminDashboard = () => {
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    return (
        <Container>
            <SearchInput
                searchEndpoint={SEARCH_PEOPLE_URL}
                onResultsFound={(results) => {}}
                getOptions={(results) => {
                    return results.map((result) => {
                        return {
                            id: result.id,
                            label: `${result.firstName} ${result.lastName}`,
                        };
                    });
                }}
                onOptionClicked={({ id, label }) => {
                    if (selectedOptions.find((option) => option.id === id)) {
                        return;
                    }
                    setSelectedOptions([...selectedOptions, { id, label }]);
                }}
            />
            <SelectedOptions
                options={selectedOptions}
                onDelete={(id) => {
                    setSelectedOptions(
                        selectedOptions.filter((option) => option.id !== id)
                    );
                }}
            />
        </Container>
    );
};

export default AdminDashboard;
