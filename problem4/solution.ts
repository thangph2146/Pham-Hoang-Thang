// Phương pháp 1: Sử dụng Array.reduce
function sum_to_n_a(n: number): number {
    return Array.from({ length: n }, (_, i) => i + 1).reduce((sum, num) => sum + num, 0);
}

// Phương pháp 2: Sử dụng công thức toán học
function sum_to_n_b(n: number): number {
    return (n * (n + 1)) / 2;
}

// Phương pháp 3: Sử dụng vòng lặp while
function sum_to_n_c(n: number): number {
    let sum = 0;
    while (n > 0) {
        sum += n;
        n--;
    }
    return sum;
} 