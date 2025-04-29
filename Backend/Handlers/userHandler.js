const { executeQuery } = require('../Modules/Azure');
let userHandler = {};

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
        return result ? result[0].User_ID : null;
    } catch (err) {
        console.error('Error authenticating user:', err);
        throw err;
    }
}

// Register new user
userHandler.registerUser = async function(user) {
    console.log('Registering user:', user);
    
    const { email, password, name } = user;
    const query = `
        INSERT INTO [dbo].[User]
        ([email], [password], [name])
        VALUES (@email, @password, @name); 
        SELECT SCOPE_IDENTITY() AS User_ID;
    `;
    const params = [
        { name: 'email', type: 'varchar', value: email },
        { name: 'password', type: 'varchar', value: password },
        { name: 'name', type: 'varchar', value: name }
    ];

    try {
        const result = await executeQuery(query, params);
        return result ? result[0].User_ID : null;
    } catch (err) {
        console.error('Error registering user:', err);
        throw err;
    }
}

// Update user
userHandler.updateUser = async function(User_ID, updatedFields) {
    const { email, password, name } = updatedFields;
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
        throw err;
    }
}

module.exports = userHandler;