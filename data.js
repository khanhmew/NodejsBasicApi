
    let listAccounts = [
        {
            username: 'account_a',
            password: '123',
            fullname: 'account a',
            friends: ['account_b']
        },
        {
            username: 'account_b',
            password: '123',
            fullname: 'account b',
            friends: ['account_a', 'account_c']
        },
        {
            username: 'account_c',
            password: '123',
            fullname: 'account c',
            friends: []
        }
    ];
    
    let listNewsFeed = [
        {
            title: `1. industry. Lorem Ipsum has been the industrys standard dum`,
            content: `Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
            author: 'account_a',
            data: '10/05/2023'
        },
        {
            title: `2. industry. Lorem Ipsum has been the industrys standard dum`,
            content: `Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
            author: 'account_b',
            data: '09/05/2023'
        },
        {
            title: `3. industry. Lorem Ipsum has been the industrys standard dum`,
            content: `Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
            author: 'account_a',
            data: '08/05/2023'
        },
        {
            title: `4. industry. Lorem Ipsum has been the industrys standard dum`,
            content: `Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
            author: 'account_b',
            data: '05/05/2023'
        },
        {
            title: `5. industry. Lorem Ipsum has been the industrys standard dum`,
            content: `Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`,
            author: 'account_a',
            data: '05/05/2023'
        }
    ]

module.exports=[listNewsFeed, listAccounts]