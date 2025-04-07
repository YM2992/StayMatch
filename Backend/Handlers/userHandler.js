const { executeQuery } = require('../Modules/Azure');
let userHandler = {};

// Authenticate user
userHandler.authenticateUser = async function(email, password) {
    const query = `
        SELECT * 
        FROM User 
        WHERE Email = @email AND Password = @password
    `;
    const params = [
        { name: 'email', type: 'varchar', value: email },
        { name: 'password', type: 'varchar', value: password }
    ];

    try {
        const result = await executeQuery(query, params);
        return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
        console.error('Error authenticating user:', err);
        throw err;
    }
}

// Register new user
userHandler.registerUser = async function(user) {
    console.log('Registering user:', user);
    
    const { email, password, first_name, last_name } = user;
    const query = `
        INSERT INTO [dbo].[User]
        ([email], [password], [first_name], [last_name])
        VALUES (@email, @password, @first_name, @last_name); 
        SELECT SCOPE_IDENTITY() AS User_ID;
    `;
    const params = [
        { name: 'email', type: 'varchar', value: email },
        { name: 'password', type: 'varchar', value: password },
        { name: 'first_name', type: 'varchar', value: first_name },
        { name: 'last_name', type: 'varchar', value: last_name }
    ];

    try {
        const result = await executeQuery(query, params);
        return result[0].User_ID;
    } catch (err) {
        console.error('Error registering user:', err);
        throw err;
    }
}

// Update user
userHandler.updateUser = async function(User_ID, updatedFields) {
    const { email, password, first_name, last_name } = updatedFields;
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
    if (first_name) {
        updates.push('First_Name = @first_name');
        params.push({ name: 'first_name', type: 'varchar', value: first_name });
    }
    if (last_name) {
        updates.push('Last_Name = @last_name');
        params.push({ name: 'last_name', type: 'varchar', value: last_name });
    }

    const query = `
        UPDATE User
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