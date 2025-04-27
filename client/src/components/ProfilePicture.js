import React from 'react';
import { Image, Form } from 'react-bootstrap';

const ProfilePicture = ({ user, isEditing, handleProfilePictureUpload, size = 100 }) => {
    if (!user) {
        return null;
    }

    const { profilePicture, firstName, lastName } = user;
    const imageUrl = profilePicture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

    const handleFileChange = (e) => {
        const file = e?.target?.files?.[0];
        if (file) {
            handleProfilePictureUpload(file);
        }
    };

    return (
        <div className="text-center">
            <Image className={"mt-2"}
                src={imageUrl}
                alt={`${firstName} ${lastName}`}
                roundedCircle
                width={size}
                height={size}
                style={{ objectFit: 'cover' }}
            />
            {isEditing && (
                <Form.Group controlId="formFile" className="mt-3">
                    <Form.Label>Zmień zdjęcie profilowe</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e)} />
                </Form.Group>
            )}
        </div>
    );
};

export default ProfilePicture;
