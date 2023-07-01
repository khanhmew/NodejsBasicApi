var express = require('express');
var session = require('express-session');
var route = express.Router();
var [listNewsFeed, listAccounts] = require('./data');
var bodyParser = require('body-parser');
route.use(bodyParser.urlencoded({ extended: true }));
route.use(session({ secret: "Shh, its a secret!" }));

function apiResponse(res, status, success, message, data) {
    return res.status(status).json({
        success: success,
        message: message,
        data: data
    });
}

// Thiết kế API cho ứng dụng có các chức năng sau (FaceFake):
// 1. API Login:        Đăng nhập (kiểm tra username và password) và trả về thông tin account đó nếu tồn tại hoặc lỗi nếu sai thông tin
route.post('/login', function (req, res) {
    const { username: usernameLogin, password: passwordLogin } = req.body;
    let isNotExistUsernameOrPassword = !usernameLogin || !passwordLogin;
    if (isNotExistUsernameOrPassword) {
        apiResponse(res, 400, false, 'Please enter both username and password', null);
    } else {
        const accountFind = listAccounts.find(function (user) {
            if (user.username === usernameLogin)
                return true;
            return false;
        });
        if (accountFind) {
            if (accountFind.password === passwordLogin) {
                req.session.user = accountFind;
                apiResponse(res, 200, true, 'Login success', accountFind);
            }
            apiResponse(res, 400, false, 'Password wrong!', null)
        }
        apiResponse(res, 400, false, 'Username not exist!', null)
    }
});
// 2. API Lấy danh sách các người dùng là bạn bè của của account (user đang request lên server)
route.get('/friends', function (req, res) {
    const { user: userForGetFriend } = req.session;
    if (typeof userForGetFriend == undefined) {
        apiResponse(res, 400, false, 'Login to see friends', null);
    } else {
        const friendsForGet = listAccounts.filter((item) => {
            if (item.friends.includes(userForGetFriend.username))
                return true;
            return false
        });
        apiResponse(res, 200, true, 'Get success', friendsForGet);
    }
});
// 3. API Lấy tất cả bài viết có author (người tạo) là bạn bè
route.get('/friends/posts', function (req, res) {
    const { user: userSeeFriendPost } = req.session;

    if (typeof userSeeFriendPost === 'undefined') {
        apiResponse(res, 400, false, 'Login to see friends!', null)
    } else {
        const friendAccount = listAccounts.filter(account => {
            return account.friends.includes(userSeeFriendPost.username);
        });

        const friendUsernames = friendAccount.map(account => account.username);

        const friendPosts = listNewsFeed.filter(post => {
            return friendUsernames.includes(post.author);
        });
        apiResponse(res, 200, true, 'Get success', friendPosts)
    }
});


// 4. Khi vào trang cá nhân-> API lấy danh sách bài viết của người dùng đang truy cập
route.get('/user/:username', function (req, res) {
    const { username: usernameForGetProfile } = req.params;
    const resultPost = listNewsFeed.filter((post) => {
        return post.author === usernameForGetProfile;
    })
    apiResponse(res, 200, true, 'Get success', resultPost);
});

// 5. API Register: tạo thêm 1 account mới & lưu vào listAccounts
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
route.post('/signup', (req, res) => {
    let isNotExistUsernameOrPassword = !usernameSignUp || !passwordSignUp || !fullnameSignUp;
    const { username: usernameSignUp, password: passwordSignUp, fullname: fullnameSignUp } = req.body;

    if (isNotExistUsernameOrPassword) {
        apiResponse(res, 400, false, 'Invalid details!', null);
    } else {
        const userExists = listAccounts.find(user => { return user.username === usernameSignUp });
        if (userExists)
            apiResponse(res, 400, false, 'User Already Exists! Login or choose another username', null);
        else {
            var listFriendNew = [];
            var newUser = { id: getRandomArbitrary(1, 1000), password: passwordSignUp, username: usernameSignUp, fullname: fullnameSignUp, friends: listFriendNew };
            listAccounts.push(newUser);
            apiResponse(res, 200, true, 'Create success', newUser)
        }
    }
});

// 6. API Update Info: cập nhật thông tin FULLNAME cho account đang gửi request
route.put('/user', function (req, res) {
    const { user } = req.session;
    if (typeof user === 'undefined') {
        apiResponse(res, 400, false, 'You must authenticate', null);
    } else {
        const { fullname: fullnameReq } = req.body;
        const accountUpdate = listAccounts.find((item) => item.username === user.username);
        if (accountUpdate) {
            const indexUser = listAccounts.indexOf(accountUpdate);
            listAccounts[indexUser].fullname = fullnameReq;
            apiResponse(res, 200, true, 'Update success', listAccounts[indexUser])
        } else {
            apiResponse(res, 400, false, 'User not found', null);
        }
    }
});

// 7. API Unfriend: Xoá account_a trong danh sách bạn bè của user account_b
route.delete('/friends', function (req, res) {
    const { user: userDelete } = req.session;
    const { username: usernameForDelete } = req.body;
    if (typeof userDelete === 'undefined') {
        apiResponse(res, 400, false, 'You must authenticate', null);
    } else {
        if (userDelete.friends.includes(usernameForDelete)) {
            const indexUserForDelete = userDelete.friends.indexOf(usernameForDelete);
            userDelete.friends.splice(indexUserForDelete, 1);
            apiResponse(res, 200, true, 'Delete success', userDelete);
        }
        else {
            apiResponse(res, 400, false, `You dont have ${userDelete} in your list friend!`, null);
        }
    }
});


// 8. API Delete Account by System: Xoá account_c ra khỏi danh sách listAccounts
route.delete('/user/:username', function (req, res) {
    const { user: userDelete } = req.session;
    if (typeof userDelete === 'undefined') {
        apiResponse(res, 400, false, 'You must authenticate', null);
    } else {
        const { username: usernameForDelete } = req.params;
        if (usernameForDelete == userDelete.username) {
            const accountForDelete = listAccounts.find(item => item.username === usernameForDelete);
            if (accountForDelete) {
                const indexUser = listAccounts.indexOf(accountForDelete);
                listAccounts.splice(indexUser, 1);
                apiResponse(res, 200, true, 'Delete success', listAccounts);
            } else {
                apiResponse(res, 400, false, 'User not found', null);
            }
        }
        else{
            apiResponse(res, 400, false, 'You has no authorize', null);
        }
    }
});


module.exports = route;