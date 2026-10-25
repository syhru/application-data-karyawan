/* global $, bootstrap */
$(function () {
  'use strict';
  const api = '/api/data-pribadi';
  const fields = ['nik', 'namaLengkap', 'tanggalLahir', 'alamat', 'negara'];
  const modalElement = document.getElementById('delete-modal');
  const modal = new bootstrap.Modal(modalElement);
  const today = new Date();
  const todayISO = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  $('#tanggalLahir').attr('max', todayISO);
  let filters = { nik: '', nama: '' };
  let mode = 'add';
  let editingNik = null;
  let returnTarget = null;
  let listRequest = null;
  let detailRequest = null;
  let saving = false;
  let deleting = false;
  let deleteRow = null;
  let deleteTarget = null;

  function notice(text) {
    $('#notice').removeClass('alert-danger').addClass('alert-success').text(text).prop('hidden', false);
  }

  function dateLabel(value) {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return day + '-' + months[Number(month) - 1] + '-' + year.slice(-2);
  }

  function renderRows(rows) {
    const body = $('#data-rows').empty();
    rows.forEach(function (row, index) {
      const tr = $('<tr>');
      [index + 1, row.nik, row.namaLengkap, row.umur, dateLabel(row.tanggalLahir), row.jenisKelamin, row.alamat, row.negara].forEach(function (value) {
        $('<td>').text(value == null ? '' : String(value)).appendTo(tr);
      });
      const actions = $('<div>').addClass('row-actions');
      ['Detail', 'Edit', 'Delete'].forEach(function (action) {
        $('<button>', { type: 'button' }).addClass('action-link action-' + action.toLowerCase()).text(action).on('click', function () {
          if (action === 'Delete') openDelete(row, this);
          else openEditor(action.toLowerCase(), row.nik, this);
        }).appendTo(actions);
      });
      $('<td>').append(actions).appendTo(tr);
      body.append(tr);
    });
  }

  function loadRows() {
    if (listRequest) listRequest.abort();
    $('#data-rows').empty();
    $('#list-status').text('Memuat data pribadi...');
    $('#monitoring').attr('aria-busy', 'true');
    listRequest = $.ajax({ url: api, data: filters, dataType: 'json' }).done(function (rows) {
      renderRows(rows);
      $('#list-status').text(rows.length ? '' : (filters.nik || filters.nama ? 'Tidak ada data yang cocok. Ubah filter lalu tekan Search.' : 'Belum ada data pribadi. Tekan Add untuk menambah data.'));
    }).fail(function (xhr, status) {
      if (status === 'abort') return;
      $('#list-status').text('Gagal memuat data pribadi. Tekan Search untuk mencoba lagi.');
    }).always(function () {
      $('#monitoring').attr('aria-busy', 'false');
    });
  }

  function clearErrors() {
    $('#data-form .is-invalid').removeClass('is-invalid').removeAttr('aria-invalid');
    $('#data-form .invalid-feedback').text('');
    $('#jenisKelamin-error, #form-error').text('').prop('hidden', true);
  }

  function fieldErrors(errors) {
    Object.entries(errors).forEach(function ([field, text]) {
      if (!fields.includes(field) && field !== 'jenisKelamin') return;
      $('#' + field + '-error').text(text).prop('hidden', false);
      $('#data-form [name="' + field + '"]').addClass('is-invalid').attr('aria-invalid', 'true');
    });
    $('#data-form .is-invalid').first().trigger('focus');
  }

  function setFormState(loading) {
    $('#data-form input, #data-form textarea, #data-form select').prop('disabled', loading || mode === 'detail' || saving);
    $('#nik').prop('readOnly', mode !== 'add');
    $('#save').prop('hidden', mode === 'detail').prop('disabled', loading || saving).text(saving ? 'Menyimpan...' : mode === 'edit' ? 'Ubah' : 'Simpan');
    $('#back').prop('disabled', saving);
  }

  function openEditor(nextMode, nik, trigger) {
    if (detailRequest) detailRequest.abort();
    mode = nextMode;
    editingNik = nik;
    returnTarget = trigger;
    clearErrors();
    $('#data-form')[0].reset();
    $('#notice').prop('hidden', true);
    $('#monitoring').prop('hidden', true);
    $('#editor').prop('hidden', false);
    $('#form-title').text(mode === 'add' ? 'Tambah Data Baru' : mode === 'edit' ? 'Edit Data Pribadi' : 'Detail Data Pribadi').trigger('focus');
    $('#form-loading').prop('hidden', mode === 'add');
    setFormState(mode !== 'add');
    if (mode === 'add') { $('#nik').trigger('focus'); return; }
    detailRequest = $.ajax({ url: api + '/' + encodeURIComponent(nik), dataType: 'json' }).done(function (row) {
      fields.forEach(function (field) { $('#' + field).val(row[field] == null ? '' : row[field]); });
      $('#data-form [name="jenisKelamin"]').each(function () { $(this).prop('checked', this.value === row.jenisKelamin); });
      setFormState(false);
    }).fail(function (xhr, status) {
      if (status === 'abort') return;
      $('#form-error').text('Gagal memuat data pribadi. Kembali lalu coba lagi.').prop('hidden', false);
    }).always(function () {
      $('#form-loading').prop('hidden', true);
    });
  }

  function backToList(refresh) {
    if (detailRequest) detailRequest.abort();
    $('#editor').prop('hidden', true);
    $('#monitoring').prop('hidden', false);
    if (refresh) loadRows();
    if (returnTarget && returnTarget.isConnected && !refresh) $(returnTarget).trigger('focus');
    else $('#add').trigger('focus');
  }

  $('#search-form').on('submit', function (event) {
    event.preventDefault();
    const nik = $('#filter-nik').val();
    if (nik && !/^[0-9]{1,16}$/.test(nik)) {
      $('#filter-error').text('NIK hanya boleh berisi angka, maksimal 16 digit.').prop('hidden', false);
      $('#filter-nik').attr('aria-invalid', 'true').trigger('focus');
      return;
    }
    $('#filter-error').prop('hidden', true);
    $('#filter-nik').removeAttr('aria-invalid');
    filters = { nik: nik, nama: $('#filter-nama').val().trim() };
    $('#notice').prop('hidden', true);
    loadRows();
  });
  $('#add').on('click', function () { openEditor('add', null, this); });
  $('#back').on('click', function () { if (!saving) backToList(false); });

  $('#data-form').on('submit', function (event) {
    event.preventDefault();
    if (saving || mode === 'detail' || $('#save').prop('disabled')) return;
    clearErrors();
    const data = {};
    fields.forEach(function (field) {
      const value = $('#' + field).val();
      data[field] = field === 'nik' ? value : (value.trim() ? value : null);
    });
    if (mode === 'edit') data.nik = editingNik;
    data.jenisKelamin = $('#data-form [name="jenisKelamin"]:checked').val() || null;
    const errors = {};
    if (!data.nik) errors.nik = 'NIK wajib diisi.';
    else if (!/^[0-9]{1,16}$/.test(data.nik)) errors.nik = 'NIK hanya boleh berisi angka, maksimal 16 digit.';
    if (!data.namaLengkap) errors.namaLengkap = 'Nama Lengkap wajib diisi.';
    else if (data.namaLengkap.length > 200) errors.namaLengkap = 'Nama Lengkap maksimal 200 karakter.';
    if (data.alamat && data.alamat.length > 5000) errors.alamat = 'Alamat maksimal 5000 karakter.';
    if (data.tanggalLahir && data.tanggalLahir > todayISO) errors.tanggalLahir = 'Tanggal Lahir tidak boleh di masa mendatang.';
    if (Object.keys(errors).length) { fieldErrors(errors); return; }
    saving = true;
    setFormState(false);
    $.ajax({ url: api + (mode === 'edit' ? '/' + encodeURIComponent(editingNik) : ''), method: mode === 'edit' ? 'PUT' : 'POST', contentType: 'application/json', data: JSON.stringify(data) }).done(function () {
      saving = false;
      backToList(true);
      notice('Data pribadi berhasil disimpan.');
    }).fail(function (xhr) {
      saving = false;
      setFormState(false);
      $('#form-error').text(xhr.status === 409 ? 'NIK sudah terdaftar.' : 'Gagal menyimpan data. Periksa isian dan koneksi lalu coba lagi.').prop('hidden', false);
    });
  });

  function openDelete(row, target) {
    deleteRow = row;
    deleteTarget = target;
    $('#delete-message').text('Anda yakin menghapus data ' + row.namaLengkap + ' ?');
    $('#delete-error').prop('hidden', true).text('');
    modal.show();
  }
  $('#delete-modal').on('shown.bs.modal', function () { $('#delete-cancel').trigger('focus'); }).on('hide.bs.modal', function (event) {
    if (deleting) event.preventDefault();
  }).on('hidden.bs.modal', function () {
    if (deleteTarget && deleteTarget.isConnected) $(deleteTarget).trigger('focus');
    else $('#add').trigger('focus');
    deleteRow = null;
  });
  $('#delete-ok').on('click', function () {
    if (deleting || !deleteRow) return;
    deleting = true;
    $('#delete-ok, #delete-cancel').prop('disabled', true);
    $('#delete-ok').text('Menghapus...');
    $.ajax({ url: api + '/' + encodeURIComponent(deleteRow.nik), method: 'DELETE' }).done(function () {
      deleting = false;
      modal.hide();
      loadRows();
      $('#add').trigger('focus');
      notice('Data pribadi berhasil dihapus.');
    }).fail(function (xhr) {
      $('#delete-error').text('Gagal menghapus data. Periksa koneksi lalu coba lagi.').prop('hidden', false);
    }).always(function () {
      deleting = false;
      $('#delete-ok, #delete-cancel').prop('disabled', false);
      $('#delete-ok').text('OK');
    });
  });
  loadRows();
});
