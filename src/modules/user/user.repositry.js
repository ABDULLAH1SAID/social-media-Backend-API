import { User } from "../../../DB/models/user.model.js";
export class UserRepository{
    
    async findById(userId, select){
        return await User.findById(userId).select(select||'');
    }
    async findByIdAndUpdate(userId, updateData, options = {}){
        return await User.findByIdAndUpdate(userId, updateData, options);
    }

    async findOne(criteria) {
        return await User.findOne(criteria);
    }
    
    async save(user) {
        return await user.save();
    }

    async findByIdWithConnections(userId) {
        return await User.findById(userId)
          .select('connections')
          .populate([
            { path: 'connections.requested', select: 'name email profileImage.url' },
            { path: 'connections.accepted', select: 'name email profileImage.url' },
          ]);
      }
    
    async addToRequest(userId, connectionId){
        return await User.findByIdAndUpdate(
           userId, 
            {$push: {'connections.requested':connectionId}}
        );
    }

    async updateConnection(userId, connectionId, operation) {
        if (operation === 'pull') {

            return await User.findByIdAndUpdate(
                userId,
                { $pull: { 'connections.accepted': connectionId } }
            );
         } else if (operation === 'push') {
              return await User.findByIdAndUpdate(
                userId,
                { $push: { 'connections.accepted': connectionId } }
             );
         }
        }
    async removeFromRequested(userId, connectionId) {
        return await User.findByIdAndUpdate(
            userId,
            { $pull: { 'connections.requested': connectionId } }
        );
        } 
}
