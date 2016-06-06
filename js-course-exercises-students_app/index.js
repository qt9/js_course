// Yout js code goes here
'use strict';
var MIN_AGE = 1;
var MAX_AGE = 99;
var iterator = 0;

$(function () {
    var $studentListingContainer = $('.student-listing-container').parent();
    var $studentDataContainer = $('.student-data-container').parent();
    var $studentFormContainer = $('.student-form-container').parent();
    var $coursesDiv = $('.student-data-group').has('.course-group');
    var $divCourseTemplate = $('div.form-group').has('label:contains("Course 1:")')
    var $studentTableBody = $('tbody');
    var $studentAge = $('.student-age');
    var $alertDanger = $('.alert-danger');
    var $alertDeleteCreate = $studentListingContainer.find('.alert.alert-success');
    $studentDataContainer.hide();
    $studentFormContainer.hide();
    $alertDanger.hide();

    function studentRowView(student) {
        var $firstNameTd = $('<td>').html(student.first_name);
        var $lastNameTd = $('<td>').html(student.last_name);
        var $studentShowAnchor = $('<a>').html('Show').addClass('btn btn-default')
            .attr('href', '#');
        var $studentEditAnchor = $('<a>').html('Edit').addClass('btn btn-primary')
            .attr('href', '#');
        var $studentDeleteAnchor = $('<a>').html('Delete').addClass('btn btn-danger')
            .attr('href', '#');
        var $actionsTd = $('<td>').append($studentShowAnchor, $studentEditAnchor, $studentDeleteAnchor).data('id', student.id);
        return $('<tr>').append($firstNameTd, $lastNameTd, $actionsTd);
    }

    for (var iterator = MIN_AGE; iterator <= MAX_AGE; iterator++)
        $studentAge.append($('<option>').text(iterator).val(iterator));

    function studentCourseView(number, course) {
        var $courseB = $('<b>').html('Course' + number + ': ');
        var $courseSpan = $('<span>').addClass('student-course').text(course);
        return $('<div>').addClass('course-group').append($courseB, $courseSpan);
    }

// При клике на show показать info server
    $(document).on('click', ".student-listing-container .btn-default", function () {
        $studentListingContainer.fadeOut(500, function () {
            $studentDataContainer.fadeIn(500)
        });
        $coursesDiv.empty();
        var selectedStudent = $(this).parent().data('id');
        $.get({
            url: 'https://spalah-js-students.herokuapp.com/students/' + selectedStudent,
            contentType: 'application/json',
            datatype: 'json',
            success: function (student) {
                $('span.student-full-name').text(student.data.first_name + ' ' +
                    student.data.last_name);
                $('span.student-age').text(student.data.age);
                $('span.student-at-university').text(student.data.at_university ? 'Yes'
                    : 'No');
                $.each(student.data.courses, function (index) {
                    $coursesDiv.append(studentCourseView(index + 1,
                        student.data.courses[index]));
                });
            }
        });
    });

    $(document).on('click', ".student-data-container .btn-default", function () {
        $('.student-data-container').parent().fadeOut(500, function () {
            $('.student-listing-container').parent().fadeIn(500);
        });
    });

    $(document).on('click', ".student-listing-container .btn-success", function () {
        $('.student-listing-container').parent().fadeOut(500, function () {
            $('.student-form-container').parent().fadeIn(500);
        });

    });

//При клике на edit показывать форму добавления студента с информацией c server
    $studentDataContainer.find('a.btn.btn-primary').click(function (event) {
        $studentDataContainer.fadeOut(500, function () {
            $studentFormContainer.fadeIn(500);
        });
        $('input.first-name').val($('span.student-full-name').text().split(' ')[0]);
        $('input.last-name').val($('span.student-full-name').text().split(' ')[1]);
        $('select.student-age').val($('span.student-age').text());
        $('input.student-at-university').prop("checked",
            $('span.student-at-university').text() == 'Yes' ? true : false);
        $('input.student-course').each(function (index) {
            $(this).val($('span.student-course').map(function () {
                return $(this).text();
            })[index]);
        });
        event.preventDefault();
    });

//при клике на edit показать форму добавления студента с информацией c server
    $(document).on('click', ".student-listing-container .btn-primary", function () {
        $('.student-listing-container').parent().fadeOut(500, function () {
            $studentFormContainer.fadeIn(500);
        });
        $('input.first-name').val($('span.student-full-name').text().split(' ')[0]);
        $('input.last-name').val($('span.student-full-name').text().split(' ')[1]);
        $('select.student-age').val($('span.student-age').text());
        $('input.student-at-university').prop("checked",
            $('span.student-at-university').text() == 'Yes' ? true : false);
        $('input.student-course').each(function (index) {
            $(this).val($('span.student-course').map(function () {
                return $(this).text();
            })[index]);
        });
        event.preventDefault();
    });

//Приклике на back вернуть на Student Profile
    $(document).on('click', ".student-form-container .btn-default", function () {
        $('.student-form-container').parent().fadeOut(500, function () {
            $studentDataContainer.fadeIn(500);
        });
    });

    //Приклике на delite удалить студента с сервера
    $(document).on('click', '.student-listing-container .btn-danger', function () {
        var studentId = $(this).parent().data('id');
        var confirmDelete = confirm('Are you sure to delee this student?');
        $('.student-listing-container div.alert-success').hide();
        var $tempId = $(this).parent().parent();
        if (confirmDelete) {

            $.ajax({
                url: 'https://spalah-js-students.herokuapp.com/students/' + studentId,
                contentType: "application/json",
                dataType: 'json',
                type: 'DELETE',
                success: function () {
                    $('.student-listing-container div.alert-success').html('Student succesfully deleted');
                    $tempId.fadeOut(1000, function () {
                        $('.student-listing-container div.alert-success').fadeIn(1000);
                    });
                }
            });
        }
    });


    $studentListingContainer.find('a.btn.btn-success').click(function (event) {
        $studentListingContainer.fadeOut(500, function () {
            $studentFormContainer.fadeIn(500);
        });
        event.preventDefault();
    });


    $('a.add-course').click(function (event) {
        var $studentCoursesCount = $('input.student-course');
        var $newCourse = $divCourseTemplate.clone(true);
        $newCourse.children('label').text('Course ' +
            ($studentCoursesCount.length + 1) + ':');
        $(this).parent().before($newCourse);
        event.preventDefault();
    });


    $studentFormContainer.delegate('a.remove-course', 'click', function (event) {
        var $deletedNumber = $(event.target).parent().children('label').text()[7];
        $(event.target).parent().remove();
        updateNumeration($deletedNumber);
        event.preventDefault();
    });

    function updateNumeration(deletedNumber) {
        var $studentCoursesCount = $('input.student-course');
        $('div.form-group label:contains("Course ")').each(function (index) {
            if (index >= deletedNumber - 1) {
                $(this).text('Course ' + (index + 1) + ':');
            }
        });
    }

    function createDataObject() {
        var result = {student: {}};
        result.student.first_name = $('input.first-name').val();
        result.student.last_name = $('input.last-name').val();
        result.student.age = $('select.student-age').val();
        result.student.at_university = $('input.student-at-university').prop("checked");
        result.student.courses = [];
        $('input.student-course').each(function (index) {
            result.student.courses.push($(this).val());
        });
        return result;
    }


    $('form').submit(function (event) {
        console.log(createDataObject());

        $.post('https://spalah-js-students.herokuapp.com/students', createDataObject());
    });

    var studentSequence = JSON.parse(localStorage.getItem('studentSequence'));
    $.get({
        url: 'https://spalah-js-students.herokuapp.com/students',
        contentType: "application/json",
        dataType: 'json',
        success: function (students) {
            $.each(studentSequence, function (index, id) {
                $.each(students.data, function (index, student) {
                    if (student.id === id) $studentTableBody.append(studentRowView(student));
                });
            });
        }
    });


    $studentTableBody.sortable({
        deactivate: function (event, ui) {
            var studentSequence = [];
            $.each($('tbody tr td:last-child'), function (index, td) {
                studentSequence.push($(td).data('id'));
            });
            localStorage.setItem('studentSequence', JSON.stringify(studentSequence));
        }
    });

    $studentTableBody.empty();
    $.get({
        url: 'https://spalah-js-students.herokuapp.com/students',
        contentType: "application/json",
        dataType: 'json',
        success: function (students) {
            $.each(students.data, function (index, student) {
                $studentTableBody.append(studentRowView(student));
                $studentTableBody.sortable();
            });
        }
    });
});