function validarCIF(cif) {
    // Expresión regular para validar el formato del CIF
    var expreg = /^[ABCDEFGHJKLMNPQRSUVW]{1}[0-9]{7}[0-9A-J]{1}$/;
    
    // Comprobamos que el CIF tiene el formato correcto
    if (!expreg.test(cif)) {
      return false;
    }
    
    // Obtenemos el primer carácter del CIF
    var letra = cif.charAt(0);
    
    // Si la letra es una A, B o C, el CIF debe tener 8 dígitos
    if (letra == 'A' || letra == 'B' || letra == 'C') {
      cif = '0' + cif;
    }
    
    // Obtenemos el número de control del CIF
    var suma = parseInt(cif.charAt(2)) + parseInt(cif.charAt(4)) + parseInt(cif.charAt(6));
    var suma2 = 0;
    var n = 0;
    
    for (var i = 1; i <= 7; i += 2) {
      n = parseInt(cif.charAt(i)) * 2;
      if (n > 9) {
        n = 1 + (n - 10);
      }
      suma2 += n;
    }
    
    var suma_total = suma + suma2;
    var control = (10 - (suma_total % 10)) % 10;
    
    // Comprobamos que el número de control del CIF es correcto
    if (control == cif.charAt(8)) {
      return true;
    } else {
      return false;
    }
  }
  

  module.exports = validarCIF