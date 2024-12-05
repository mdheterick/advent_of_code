import { fetchInput } from "../../fetchInput";
import { sum } from "../../utils";

const data = await fetchInput(2024, 5);

const example = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

const input = data;

class Order {
    before: number;
    after: number;
    constructor(data: string) {
        const split = data.split("|");
        this.before = Number(split[0]);
        this.after = Number(split[1]);
    }

    isRelevant(update: Update) {
        return update.pages.includes(this.before) && update.pages.includes(this.after);
    }

    updateInOrder(update: Update) {
        return update.pages.indexOf(this.before) < update.pages.indexOf(this.after);
    }

    applyOrder(update: Update) { // mutates, return is whether change was made
        if (this.updateInOrder(update)) return false;
        const beforeIndex = update.pages.indexOf(this.before);
        const afterIndex = update.pages.indexOf(this.after);
        update.pages[beforeIndex] = this.after;
        update.pages[afterIndex] = this.before;
        return true;
    }
}

class Update {
    pages: number[];
    constructor(data: string) {
        this.pages = data.split(",").map(p => Number(p));
    }

    inOrder(orders: Array<Order>) {
        const relevantOrders = orders.filter(o => o.isRelevant(this));
        return relevantOrders.every(o => o.updateInOrder(this));
    }

    middleNumber() {
        return this.pages[Math.floor(this.pages.length / 2)];
    }

    reorder(orders: Array<Order>) {
        const relevantOrders = orders.filter(o => o.isRelevant(this));
        const ret = new Update([...this.pages].join(","));
        let runOrders = true;
        while (runOrders) { // if an order mutated the the update, then rerun all orders, keep going until no more mutations
            runOrders = false;
            for (const order of relevantOrders) {
                runOrders = order.applyOrder(ret) || runOrders;
            }
        }
        return ret;
    }
}


const [_orders, _updates] = input.split("\n\n").map(section => section.split("\n"));
const orders = _orders.map(o => new Order(o));
const updates = _updates.map(u => new Update(u));

console.log("Part 1", sum(updates.filter(u => u.inOrder(orders)).map(u => u.middleNumber())));

const unordered = updates.filter(u => !u.inOrder(orders));
const reordered = unordered.map(u => u.reorder(orders));
console.log("Part 2", sum(reordered.filter(u => u.inOrder(orders)).map(u => u.middleNumber())))
