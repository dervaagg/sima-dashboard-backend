function countSemester(angkatan) {
    const currentDate = new Date()
    let currentSmt = (currentDate.getFullYear() - angkatan) * 2

    // !!! Recheck countSemester
    if (currentDate.getMonth() > 6) currentSmt++
    return currentSmt
}

module.exports = countSemester