const { executeQuery } = require('../Modules/Azure');
let userHandler = {};

// Get user by email
userHandler.getUserByEmail = async function(email) {
    const query = `
        SELECT * 
        FROM [dbo].[User] 
        WHERE email = @email
    `;
    const params = [
        { name: 'email', type: 'varchar', value: email }
    ];

    try {
        const result = await executeQuery(query, params);
        return result ? result[0] : null;
    } catch (err) {
        console.error('Error fetching user by email:', err);
        throw err;
    }
}

// Authenticate user
userHandler.authenticateUser = async function(email, password) {
    const query = `
        SELECT * 
        FROM [dbo].[User] 
        WHERE Email = @email AND Password = @password
    `;
    const params = [
        { name: 'email', type: 'varchar', value: email },
        { name: 'password', type: 'varchar', value: password }
    ];

    try {
        const result = await executeQuery(query, params);
        return (result && result.length > 0) ? result[0].User_ID : null;
    } catch (err) {
        console.error('Error authenticating user:', err);
        throw err;
    }
}

// Register new user
userHandler.registerUser = async function(name, email, password, securityQuestion, securityAnswer) {
    // Check if user already exists
    const existingUser = await userHandler.getUserByEmail(email);
    if (existingUser) {
        console.error('User already exists:', email);
        throw new Error('User already exists');
    }

    console.log('Registering user:', email);
    
    const query = `
        INSERT INTO [dbo].[User]
        ([name], [email], [password], [security_question], [security_answer])
        VALUES (@name, @email, @password, @securityQuestion, @securityAnswer); 
        SELECT SCOPE_IDENTITY() AS User_ID;
    `;
    const params = [
        { name: 'email', type: 'varchar', value: email },
        { name: 'password', type: 'varchar', value: password },
        { name: 'name', type: 'varchar', value: name },
        { name: 'securityQuestion', type: 'varchar', value: securityQuestion },
        { name: 'securityAnswer', type: 'varchar', value: securityAnswer }
    ];

    try {
        const result = await executeQuery(query, params);
        return (result && result.length > 0) ? result[0].User_ID : null;
    } catch (err) {
        console.error('Error registering user:', err);
        throw new Error('Failed to register user. Please try again later.');
    }
}

// Update user
userHandler.updateUser = async function(User_ID, updatedFields) {
    const { email, password, name, securityQuestion, securityAnswer } = updatedFields;
    const updates = [];
    const params = [{ name: 'User_ID', type: 'Int', value: User_ID }];

    if (email) {
        updates.push('Email = @email');
        params.push({ name: 'email', type: 'varchar', value: email });
    }
    if (password) {
        updates.push('Password = @password');
        params.push({ name: 'password', type: 'varchar', value: password });
    }
    if (name) {
        updates.push('Name = @name');
        params.push({ name: 'name', type: 'varchar', value: name });
    }
    if (securityQuestion) {
        updates.push('Security_Question = @securityQuestion');
        params.push({ name: 'securityQuestion', type: 'varchar', value: securityQuestion });
    }
    if (securityAnswer) {
        updates.push('Security_Answer = @securityAnswer');
        params.push({ name: 'securityAnswer', type: 'varchar', value: securityAnswer });
    }

    const query = `
        UPDATE [dbo].[User]
        SET ${updates.join(', ')}, UpdatedAt = GETDATE()
        WHERE User_ID = @User_ID;
    `;

    try {
        await executeQuery(query, params);
        return true;
    } catch (err) {
        console.error('Error updating user:', err);
        throw new Error('Failed to update user. Please try again later.');
    }
}

// Reset password
userHandler.resetPassword = async function(email, newPassword, securityQuestion, securityAnswer) {
    // Check if user exists
    const existingUser = await userHandler.getUserByEmail(email);
    if (!existingUser) {
        console.error('User not found:', email);
        throw new Error('User not found');
    }

    if (existingUser.security_question !== securityQuestion || existingUser.security_answer !== securityAnswer) {
        console.error('Security question or answer is incorrect for user:', email);
        throw new Error('Security question or answer is incorrect');
    }

    console.log('Resetting password for user:', email);

    const query = `
        UPDATE [dbo].[User]
        SET password = @newPassword
        WHERE email = @email AND security_question = @securityQuestion AND security_answer = @securityAnswer;
    `;
    const params = [
        { name: 'email', type: 'varchar', value: email },
        { name: 'newPassword', type: 'varchar', value: newPassword },
        { name: 'securityQuestion', type: 'varchar', value: securityQuestion },
        { name: 'securityAnswer', type: 'varchar', value: securityAnswer }
    ];

    try {
        await executeQuery(query, params);
        return true;
    } catch (err) {
        console.error('Error resetting password:', err);
        throw new Error('Failed to reset password. Please try again later.');
    }
}

module.exports = userHandler;