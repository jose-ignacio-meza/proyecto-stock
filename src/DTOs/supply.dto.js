class SupplyDTO {
    constructor({ type, quantity, lastUpdated, printerModel }) {
        this.type = type;
        this.quantity = quantity;
        this.lastUpdated = lastUpdated;
        this.printerModel = printerModel;
    }
}

export default SupplyDTO;