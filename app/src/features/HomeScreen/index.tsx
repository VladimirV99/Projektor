import axiosAuthInstance from 'axios/instance';

const HomeScreen = () => {
    return (
        <div>
            <button
                onClick={() => {
                    axiosAuthInstance
                        .get(
                            'http://localhost:7060/api/v1/Administrator/GetAllUsers'
                        )
                        .then(() => {
                            console.log('success');
                        })
                        .catch(() => {
                            console.log('error');
                        });
                }}
            >
                Hello
            </button>
        </div>
    );
};

export default HomeScreen;
