import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type StarIconProps = {
    active: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
};

const StarIcon = ({
    active,
    onMouseEnter,
    onMouseLeave,
    onClick,
}: StarIconProps): JSX.Element => {
    return (
        <FontAwesomeIcon
            icon={faStar}
            style={active ? { color: '#cec323' } : { color: 'gray' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        />
    );
};

export default StarIcon;
