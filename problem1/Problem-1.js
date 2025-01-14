// # Task

// Provide 3 unique implementations of the following function in JavaScript.

// **Input**: `n` - any integer

// *Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

// **Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.




// Cách 1: Sử dụng vòng lặp for
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Cách 2: Sử dụng công thức toán học n*(n+1)/2
var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

// Cách 3: Sử dụng phương thức reduce với Array
var sum_to_n_c = function(n) {
    return Array.from({length: n}, (_, i) => i + 1).reduce((sum, num) => sum + num, 0);
};

// Giải thích từng cách:
// sum_to_n_a:
// Sử dụng vòng lặp for truyền thống
// Duyệt từ 1 đến n và cộng dồn vào biến sum
// Đây là cách tiếp cận đơn giản và dễ hiểu nhất
// sum_to_n_b:
// Sử dụng công thức toán học: sum = n(n+1)/2
// Đây là cách hiệu quả nhất với độ phức tạp O(1)
// Công thức này được phát hiện bởi Carl Friedrich Gauss
// sum_to_n_c:
// Sử dụng phương pháp lập trình hàm
// Tạo mảng từ 1 đến n bằng Array.from()
// Dùng reduce() để tính tổng các phần tử trong mảng
// Cách này ngắn gọn nhưng không hiệu quả bằng hai cách trên về mặt hiệu suất
// Tất cả ba cách đều cho kết quả giống nhau. Ví dụ với n = 5: