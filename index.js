//pantalla
const display = document.getElementById("calculator_display");

//contenedor de teclas
const keysContainer = document.getElementById("calculator_keys");

//tecla de igual
const eq = document.getElementsByClassName("key_eq");
const keyEq = eq[0].innerText;
//contenido de la pantalla
let currentOperation = "0";

//flag para poder detectar si ya se igualo
let done = false;

//eventos
keysContainer.addEventListener("click", function (e) {
  //valor de la tecla
  const keyValue = e.target.innerText;

  //si es una operacion
  const isOperation = isNaN(keyValue);

  //el ultimo caracter
  const lastChar = currentOperation[currentOperation.length - 1];

  //si esta en cero
  const isZero = currentOperation === "0";

  //si ya se completo alguna operacion
  if (done) {
    // si se presiona una tecla de funcion
    if (
      keyValue === "+" ||
      keyValue === "-" ||
      keyValue === "*" ||
      keyValue === "÷" ||
      keyValue === "+" ||
      keyValue === "="
    ) {
      // se deja el resultado
      currentOperation = currentOperation;
    } else {
      //sino limpio el valor por el nuevo
      currentOperation = "";
    }
    //cambio el flag a falso en cualquier caso para poder empezar un nuevo ciclo.
    done = false;
  }

  // si no es una operacion
  if (!isOperation) {
    //si esta en cero
    if (isZero) {
      currentOperation = keyValue;
    } else {
      currentOperation += keyValue;
    }
  } else {
    //si es una operacion

    console.log(keyValue);
    if (keyValue === "CE") {
      currentOperation = "0";
    } else if (keyValue !== keyEq) {
      if ((isZero && keyValue === "x") || (isZero && keyValue === "÷")) {
        return;
      }
      //si no esta en cero
      if (isNaN(lastChar)) {
        currentOperation = currentOperation.slice(0, -1);
      }
      currentOperation += keyValue;
    } else if (keyValue === keyEq) {
      //si se presiona la tecla de igualar
      done = true;

      //Separamos en terminos
      const parsedOperations = currentOperation.match(/[^+-]+|[+-]/g);

      //resultados parciales de multiplicaciones y divisiones
      let parcialResults = parsedOperations.map((operation) => {
        //separamos los simbolos
        const x = operation.split("");

        //si se multiplica
        if (x.includes("x")) {
          //reduce con multiplicacion
          return x.reduce((acc, curr) => {
            acc = Number(acc);

            if (isNaN(curr)) {
              return acc;
            }
            return acc * curr;
          });
        } else if (x.includes("÷")) {
          //reduce con division
          return x.reduce((acc, curr) => {
            acc = Number(acc);

            if (isNaN(curr)) {
              return acc;
            }
            return acc / curr;
          });
        } else {
          //si no se divide o se multiplica se devuelve el simbolo
          if (!isNaN(operation)) {
            operation = Number(operation);
          }
          return operation;
        }
      });

      let nextOperation = "add";

      const total = parcialResults.reduce((acc, curr) => {
        if (curr === "+") {
          nextOperation = "add";
          return acc;
        } else if (curr === "-") {
          nextOperation = "subtract";
          return acc;
        } else {
          if (nextOperation === "add") {
            acc += curr;
          } else if (nextOperation === "subtract") {
            acc -= curr;
          }
        }
        return acc;
      });
      done = true;
      currentOperation = total.toString();
    }
  }
  display.innerText = currentOperation || "0";
});
