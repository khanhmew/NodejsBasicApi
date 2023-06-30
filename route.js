var express = require('express');
var session = require('express-session');
var route = express.Router();
var [listNewsFeed, listAccounts] = require('./data');
var bodyParser = require('body-parser');
const { error } = require('console');
const { ok } = require('assert');
route.use(bodyParser.urlencoded({ extended: true }));
route.use(session({ secret: "Shh, its a secret!" }));
// Thiết kế API cho ứng dụng có các chức năng sau (FaceFake):
// 1. API Login:        Đăng nhập (kiểm tra username và password) và trả về thông tin account đó nếu tồn tại hoặc lỗi nếu sai thông tin
route.post('/login', function (req, res) {
    const { username: usernameReq, password: passwordReq } = req.body;
    let isNotExistUsernameOrPassword = !req.body.username || !req.body.password;
    if (isNotExistUsernameOrPassword) {
        res.json({ message: 'Please enter both username and password' });
    } else {
        const accountFind = listAccounts.find(function (user) {
            if (user.username === usernameReq)
                return true;
            return false;
        });
        if (accountFind) {
            if (accountFind.password === passwordReq) {
                req.session.user = accountFind;
                res.json({ user: accountFind })
            }
            res.json({ message: 'Password wrong!' })
        }
        res.status(400).json({ message: 'Username not exist!' });
    }
});
// 2. API Lấy danh sách các người dùng là bạn bè của của account (user đang request lên server)
route.get('/friends', function (req, res) {
    const { user } = req.session;
    if (typeof user === undefined) {
        res.send('Login to see friends');
    } else {
        const result = listAccounts.filter((item) => {
            if (item.friends.includes(user.username))
                return true;
            return false
        });
        res.json({ result: result });
    }
});
// 3. API Lấy tất cả bài viết có author (người tạo) là bạn bè
route.get('/friends/posts', function (req, res) {
    const { user } = req.session;
    if (typeof user === 'undefined') {
        res.status(400).json({ error: 'Login to see friends!' });
    } else {
        const resultPost = listNewsFeed.filter((post) => {
            const authorAccount = listAccounts.find((account) => account.username === post.author);
            return authorAccount && authorAccount.friends.includes(user.username);
        });
        res.json({ Post: resultPost });
    }
});

// 4. Khi vào trang cá nhân-> API lấy danh sách bài viết của người dùng đang truy cập
route.get('/user/:username', function (req, res) {
    const { username } = req.params;
    const resultPost = listNewsFeed.filter((post) => {
        return post.author === username;
    })
    res.send({ resultPost });
});

// 5. API Register: tạo thêm 1 account mới & lưu vào listAccounts
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

route.get('/signup', function (req, res) {
    res.send('ok');
});

route.post('/signup', (req, res) => {
    let isNotExistUsernameOrPassword = !req.body.password || !req.body.username || !req.body.fullname;
    const { username: usernameReq, password: passwordReq, fullname: fullnameReq } = req.body;

    if (isNotExistUsernameOrPassword) {
        res.status(400).json({ error: "Invalid details!" })
    } else {
        listAccounts.filter((user) => {
            if (user.username === usernameReq) {
                res.status(400).json({ error: "User Already Exists! Login or choose another username" })
            }
        });
        var listFriendNew = [];
        var newUser = { id: getRandomArbitrary(1, 1000), password: passwordReq, username: usernameReq, fullname: fullnameReq, friends: listFriendNew };
        listAccounts.push(newUser);
        res.json({ user: newUser })
    }
});

// 6. API Update Info: cập nhật thông tin FULLNAME cho account đang gửi request
route.put('/user/update', function (req, res) {
    const { user } = req.session;
    if (typeof user === 'undefined') {
        res.status(400).json({ error: 'You must authenticate' });
    } else {
        const { fullname: fullnameReq } = req.body;
        const accountUpdate = listAccounts.find((item) => item.username === user.username);
        if (accountUpdate) {
            const indexUser = listAccounts.indexOf(accountUpdate);
            listAccounts[indexUser].fullname = fullnameReq;
            res.json({ listAccounts: listAccounts[indexUser] });
        } else {
            res.status(400).json({ error: 'User not found' });
        }
    }
});

// 7. API Unfriend: Xoá account_a trong danh sách bạn bè của user account_b
route.delete('/friends/delete', function (req, res) {
    console.log(`before:  ${listAccounts}`);
    const { username } = req.body;
    let indexToUserDelete = -1;
    let indexUserHaveUserDelete = -1;
    const result = listAccounts.filter((item) => {
        if (item.friends.includes(username)) {
            indexToUserDelete = item.friends.indexOf(username);
            indexUserHaveUserDelete = listAccounts.indexOf(item);
            return true;
        }
        return false;
    });
    if (result.length !== 0 && indexToUserDelete !== -1) {
        listAccounts[indexUserHaveUserDelete].friends.splice(indexToUserDelete, 1);
    }
    console.log(`after:  ${listAccounts}`);
    res.json({ result: listAccounts });
});


// 8. API Delete Account by System: Xoá account_c ra khỏi danh sách listAccounts
route.delete('/user/delete/:username', function (req, res) {
    const { user } = req.session;
    if (typeof user === 'undefined') {
        res.status(400).json({ error: 'You must authenticate' });
    } else {
        const { username: usernameReq } = req.params;
        const accountDelete = listAccounts.find((item) => item.username === usernameReq);
        if (accountDelete) {
            const indexUser = listAccounts.indexOf(accountDelete);
            listAccounts.splice(indexUser, 1);
            res.json({ result: listAccounts });
        } else {
            res.status(400).json({ error: 'User not found' });
        }
    }
});


module.exports = route;