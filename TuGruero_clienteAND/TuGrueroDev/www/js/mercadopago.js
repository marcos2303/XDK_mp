Mercadopago.setPublishableKey("TEST-6d4e759f-3000-4816-bb77-45ce06df576e");
Mercadopago.getIdentificationTypes();


                        function addEvent(el, eventName, handler){
                            //console.log(el);
                            if (el.addEventListener) {
                                   el.addEventListener(eventName, handler);
                            } else {
                                el.attachEvent('on' + eventName, function(){
                                  handler.call(el);
                                });
                            }
                        };

                        function getBin() {
                            var ccNumber = document.querySelector('input[data-checkout="cardNumber"]');
                            return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
                        };

                        function guessingPaymentMethod(event) {
                            var bin = getBin();

                            if (event.type == "keyup") {
                                if (bin.length >= 6) {
                                    Mercadopago.getPaymentMethod({
                                        "bin": bin
                                    }, setPaymentMethodInfo);
                                }
                            } else {
                                setTimeout(function() {
                                    if (bin.length >= 6) {
                                        Mercadopago.getPaymentMethod({
                                            "bin": bin
                                        }, setPaymentMethodInfo);
                                    }
                                }, 100);
                            }
                        };

                        function setPaymentMethodInfo(status, response) {
                            if (status == 200) {
                                // do somethings ex: show logo of the payment method
                                var form = document.querySelector('#pay');

                                if (document.querySelector("input[name=paymentMethodId]") == null) {
                                    var paymentMethod = document.createElement('input');
                                    paymentMethod.setAttribute('name', "paymentMethodId");
                                    paymentMethod.setAttribute('type', "hidden");
                                    paymentMethod.setAttribute('value', response[0].id);

                                    form.appendChild(paymentMethod);
                                } else {
                                    document.querySelector("input[name=paymentMethodId]").value = response[0].id;
                                }
                            }
                        };

                        addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'keyup', guessingPaymentMethod);
                        addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'change', guessingPaymentMethod);

                        doSubmit = false;
                        addEvent(document.querySelector('#pay'),'submit',doPay);
                        function doPay(event){
                            event.preventDefault();
                            if(!doSubmit){
                                var $form = document.querySelector('#pay');
                                Mercadopago.createToken($form, sdkResponseHandler); // The function "sdkResponseHandler" is defined below

                                return false;
                            }
                        };
                        function sdkResponseHandler(status, response) {
                            

                            if($('#email').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el correo electrónico</p>");
                                return false;
                            }
                            if($('#cardNumber').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Número de tarjeta</p>");
                                return false;
                            }
                            if($('#securityCode').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Código de seguridad</p>");
                                return false;
                            }
                            if($('#cardExpirationYear').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Año de vencimiento</p>");
                                return false;
                            }

                            if($('#cardExpirationMonth').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Mes de vencimiento</p>");
                                return false;
                            }
                            if($('#cardholderName').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Titular</p>");
                                return false;
                            }
                            if($('#docType').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Tipo de documento</p>");
                                return false;
                            }
                            if($('#docNumber').val().length==0)
                            {
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique el Número de documento</p>");
                                return false;
                            }
                            if (status != 200 && status != 201) {
                                console.log("verify filled data");
                                console.log(status + response);
                                muestraError("<p><h3>Error con los datos indicados</h3></p></p>Verifique e intente nuevamente</p>");

                            }else{


                                var form = document.querySelector('#pay');

                                var card = document.createElement('input');
                                card.setAttribute('name',"token");
                                card.setAttribute('type',"hidden");
                                card.setAttribute('value',response.id);
                                form.appendChild(card);
                                doSubmit=true;
                                enviarSolicitud();
                                //form.submit();
                                

                                
                                
                            }
                        };
     
function muestraError(mensaje){
                            var parametros = {
                                "popup": "pop-generic",
                                "imagen": "Alto",
                                "mensaje": mensaje,
                                "displaybarra": ['none'],
                                "displaysBotones": ['none', 'none', 'inline', 'none'],
                                "text": ['', '', 'Cerrar', ''],
                                //"onClick": ["", "", "", "mostrarTaxi()"]
                                "onClick": ["", "", "closePops()", ""]

                        };
                        genericPop(parametros);
}
