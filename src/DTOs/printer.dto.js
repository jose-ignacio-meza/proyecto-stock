class PrinterDTO {
    constructor({
        floor,
        office,
        dependency,
        brand,
        model,
        install,
        oblea,
        ip,
        serial,
        counter,
        fechaCounter,
        status,
        supplies,
        createdAt,
        updatedAt,
    }) {
        this.floor = floor;
        this.office = office;
        this.dependency = dependency;
        this.brand = brand;
        this.model = model;
        this.install = install;
        this.oblea = oblea;
        this.ip = ip;
        this.serial = serial;
        this.counter = counter;
        this.fechaCounter = fechaCounter;
        this.status = status;
        this.supplies = supplies;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default PrinterDTO;