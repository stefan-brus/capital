class AvailableJobs {

    constructor() {
        // TODO: Figure out level mechanics. Education/networking?
        this.level = 1;
        this.jobs = [];
    }

    generate() {
        this.jobs = [];
        for(i = 0; i < this.level + 1; i++) {
            this.jobs.push(generateJob(this.level));
        }
    }
}

/**
 * The algorithm for generating a new job:
 *
 * The generated job starts with 0.01 wage, 0.00 costs, 0.00 stress
 *
 * Each level gives 1 point, so a level 3 job has 3 points to spend.
 * An action is generated until all points are spent.
 * Each action can be positive or negative. A positive action costs 1 point, and a negative action gain 1 points.
 * Positive actions:
 * - Increase wage by 0.01
 * - Decrease costs by 0.01
 * - Decrease stress by 0.01
 * Negative actions:
 * - Decrease wage by 0.01 (note that wage cannot go below 0.01)
 * - Increase costs by 0.01
 * - Increase stress by 0.01
 */

function generateJob(level) {
    const job = new Job(`Level ${level}`, `A level ${level} job`, 0.01, 0.00, 0.00);
    let points = level;

    const actions = [

        // POSITIVE

        () => {
            job.wage += 0.01;
            return true;
        },
        () => {
            job.costs -= 0.01;
            return true;
        },
        () => {
            job.stress -= 0.01;
            return true;
        },

        // NEGATIVE

        () => {
            if (job.wage >= 0.02) {
                job.wage -= 0.01;
                return false;
            }
            else {
                points++;
                return true;
            }
        },
        () => {
            job.costs += 0.01;
            return false;
        },
        () => {
            job.stress += 0.01;
            return false;
        },
    ];

    while (points > 0) {
        const action = actions[Math.floor(Math.random() * actions.length)];
        if (action()) {
            points--;
        }
        else {
            points++;
        }
    }

    return job;
}
