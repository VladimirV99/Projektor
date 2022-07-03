import { Button } from '@mui/material';
import FormInput from 'components/FormInput';
import PageTitle from 'components/PageTitle';
import { Fragment, useState } from 'react';

const ContactUs = () => {
    const [name, setName] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const submit = () => {
        window.open(
            `mailto:chekov.projektor@gmail.com?subject=${subject}&body=${message}`
        );
    };

    const renderForm = () => (
        <div>
            <h1 style={{ textAlign: 'center', paddingTop: '20px' }}>
                Contact Us
            </h1>
            <form
                style={{
                    paddingTop: '50px',
                    width: '500px',
                }}
                onSubmit={submit}
            >
                <FormInput
                    label="Username"
                    value={name}
                    type="text"
                    required
                    onChange={(e) => setName(e.currentTarget.value)}
                />
                <FormInput
                    label="Subject"
                    value={subject}
                    type="text"
                    required
                    onChange={(e) => setSubject(e.currentTarget.value)}
                />
                <FormInput
                    multiline
                    label="Message"
                    value={message}
                    type="text"
                    required
                    onChange={(e) => setMessage(e.currentTarget.value)}
                />
                <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    disabled={false}
                >
                    Submit
                </Button>
            </form>
        </div>
    );

    return (
        <Fragment>
            <PageTitle title="Contact Us" />
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {renderForm()}
            </div>
        </Fragment>
    );
};

export default ContactUs;
