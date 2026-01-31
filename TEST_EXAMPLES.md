# Test Sessions - Example Inputs for Each Language

Test the AI responses with these realistic overthinking scenarios in each language.

## English (en)
```
Input: "I want to start a business but I keep researching competitors instead of taking action. I've been planning for 6 months."
Expected Type: avoidance or perfectionism
Expected Action: Something concrete like "Write 3 bullet points describing your unique offer" or "Send one email to a potential customer"
```

```
Input: "I'm scared to apply for that job because I might not be qualified enough even though I meet most requirements"
Expected Type: fear
Expected Action: "Click 'apply' on the job posting and attach your current resume"
```

## Swedish (sv)
```
Input: "Jag vill börja träna men jag vet inte vilken gym jag ska välja. Det finns för många alternativ i min stad."
Expected Type: decision_overload
Expected Action: "Boka en gratis provträning på närmaste gymmet idag"
```

```
Input: "Jag fortsätter tänka på ett dåligt möte jag hade förra veckan och vad jag borde ha sagt annorlunda"
Expected Type: rumination
Expected Action: "Skriv ner tre saker du lärde dig från mötet, sedan stäng anteckningsboken"
```

## Czech (cs)
```
Input: "Chci změnit kariéru ale mám strach z neúspěchu. Co když udělám chybu?"
Expected Type: fear
Expected Action: "Napište email jedné osobě ve vámi zvoleném oboru a zeptejte se na radu"
```

```
Input: "Plánuji přestěhování už rok ale nemůžu se rozhodnout do kterého města. Všechny mají výhody i nevýhody."
Expected Type: decision_overload
Expected Action: "Vytvořte seznam s 3 městy a přiřaďte každému číslo. Hoďte kostkou."
```

## Slovak (sk)
```
Input: "Chcem začať online kurz ale musím najprv dokončiť svoju webstránku, logo a všetky materiály"
Expected Type: perfectionism
Expected Action: "Napíšte jednu lekciu kurzu do Google Docs a zdieľajte ju s jedným človekom"
```

```
Input: "Neustále premýšľam o tom, čo si ostatní myslia o mojich sociálnych médiách"
Expected Type: rumination
Expected Action: "Zvoľte jeden projekt na dnes a vypnite notifikácie sociálnych sietí na 3 hodiny"
```

## Russian (ru)
```
Input: "Я хочу начать учить новый язык но не могу выбрать между испанским, французским и итальянским"
Expected Type: decision_overload
Expected Action: "Скачайте Duolingo и пройдите первый урок испанского за 5 минут"
```

```
Input: "Я избегаю сложных разговоров с коллегами потому что боюсь конфликта"
Expected Type: avoidance
Expected Action: "Напишите 2 предложения о том, что вы хотите сказать. Только напишите, не отправляйте."
```

## Ukrainian (uk)
```
Input: "Я весь час відкладаю написання резюме бо воно має бути ідеальним"
Expected Type: perfectionism
Expected Action: "Відкрийте Word і напишіть своє ім'я, email і останню посаду. Зараз. 2 хвилини."
```

```
Input: "Не можу зупинитися думати про минулі помилки на роботі"
Expected Type: rumination
Expected Action: "Встаньте, вийдіть на 5-хвилинну прогулянку, залиште телефон вдома"
```

## Testing Tips

1. **API Response Time**: Should be < 5 seconds
2. **Action Quality**: Should be specific, not vague (good: "write 3 bullet points", bad: "start planning")
3. **Language Consistency**: Response should match input language
4. **Type Accuracy**: AI should correctly identify overthinking pattern
5. **Tone**: Should be warm but direct, not preachy

## Expected Response Format
```json
{
  "success": true,
  "data": {
    "type": "fear",
    "action": "Concrete next step in 10-20 words",
    "ignore": "Specific unhelpful thought to dismiss",
    "reframe": "Grounding truth for this moment"
  },
  "metadata": {
    "language": "en",
    "timestamp": "2025-01-30T...",
    "model": "claude-sonnet-4-20250514"
  }
}
```

## Manual Testing Checklist
- [ ] Test all 6 languages
- [ ] Verify action is specific and actionable
- [ ] Check character limits respected
- [ ] Confirm proper JSON format
- [ ] Test error handling (empty input, too long input)
- [ ] Verify offline detection
- [ ] Check timer functionality
- [ ] Test copy/share features
- [ ] Confirm theme toggle works
- [ ] Verify language persistence
- [ ] Test on mobile device
- [ ] Check PWA installation prompt
