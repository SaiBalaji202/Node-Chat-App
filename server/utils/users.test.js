const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [
                                {
                                    id: '1', 
                                    name: 'Ravi', 
                                    room: 'Node Course'
                                }, 
                                {
                                    id: '2', 
                                    name: 'Ram', 
                                    room: 'React Course'
                                }, 
                                {
                                    id: '3', 
                                    name: 'Balaji', 
                                    room: 'Node Course'
                                }
                            ];
    });

    it('should add a new user', () => {
        var users = new Users();
        var user = {
            id: '123', 
            name: 'Raj', 
            room: 'The Official Room'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(resUser).toEqual(user);
        expect(users.users).toEqual([user]);
        expect(users.users.length).toBe(1);        
    });
    
    it('should remove a user', () => {
        var userId = '1';
        var removedUser = users.removeUser(userId);
        expect(removedUser.id).toBe('1');
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        var userId = '888';
        var removedUser = users.removeUser(userId);
        expect(removedUser).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find a user', () => {
        var userId = '1';
        var findedUser = users.getUser(userId);
        expect(findedUser.id).toBe(userId);
    });

    it('should not find a user', () => {
        var userId = '888';
        var findedUser = users.getUser(userId);
        expect(findedUser).toNotExist();
    });

    it('should get Node Course user list', () => {
        var expectedResUserNames = ['Ravi', 'Balaji'];
        var resUserNames = users.getUserList('Node Course');
        expect(resUserNames).toEqual(expectedResUserNames);
    });

    it('should get React Course user list', () => {
        var expectedResUserNames = ['Ram'];
        var resUserNames = users.getUserList('React Course');
        expect(resUserNames).toEqual(expectedResUserNames);
    });
});