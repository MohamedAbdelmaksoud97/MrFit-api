"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedUserRepository = exports.FakeUserRepository = void 0;
class FakeUserRepository {
    // المخزن الوهمي بتاعنا (Array في الميموري)
    users = [];
    async save(user) {
        // لو اليوزر موجود بنحدثه، لو مش موجود بنضيفه
        const index = this.users.findIndex((u) => u.getEmail() === user.getEmail());
        if (index >= 0) {
            this.users[index] = user;
        }
        else {
            this.users.push(user);
        }
        console.log("✅ [Fake DB]: User saved successfully!", user.getName());
    }
    async findByEmail(email) {
        const user = this.users.find((u) => u.getEmail() === email);
        return user || null;
    }
    async exists(email) {
        return this.users.some((u) => u.getEmail() === email);
    }
    async findById(id) {
        const user = this.users.find((u) => u.getId() === id);
        return user || null;
    }
    async delete(id) {
        this.users = this.users.filter((u) => u.getId() !== id);
    }
}
exports.FakeUserRepository = FakeUserRepository;
exports.sharedUserRepository = new FakeUserRepository();
