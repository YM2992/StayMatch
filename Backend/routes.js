const apiPath = '/api';
const routes = [
    /* User */
    {
        path: `${apiPath}/user/register`,
        method: 'post',
        handler: async (req, res) => {

        }
    },
    {
        path: `${apiPath}/user/login`,
        method: 'get',
        handler: (req, res) => {
            res.json({ message: 'User route' });
        }
    },

    /* Hotels */
    {
        path: `${apiPath}/hotels`,
        method: 'get',
        handler: async (req, res) => {
            
        }
    }
];

export default routes;