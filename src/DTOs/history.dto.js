class HistoryDTO {
    constructor({ item, action, timestamp, userId, details }) {
        this.item = item;
        this.action = action;
        this.timestamp = timestamp || new Date();
        this.userId = userId;
        this.details = details;
    }
}

export default HistoryDTO;