'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../../components/ui/logoutbutton';




export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <h1>Profile</h1>
            {user ? (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
            <LogoutButton />    
        </div>
    );
};